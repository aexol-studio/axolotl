import { AllTypesProps, ReturnTypes, Ops } from './const';
export const HOST = "Specify host";
export const HEADERS = {};
export const apiSubscription = (options) => (query) => {
    try {
        const queryString = options[0] + '?query=' + encodeURIComponent(query);
        const wsString = queryString.replace('http', 'ws');
        const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
        const webSocketOptions = options[1]?.websocket || [host];
        const ws = new WebSocket(...webSocketOptions);
        return {
            ws,
            on: (e) => {
                ws.onmessage = (event) => {
                    if (event.data) {
                        const parsed = JSON.parse(event.data);
                        const data = parsed.data;
                        return e(data);
                    }
                };
            },
            off: (e) => {
                ws.onclose = e;
            },
            error: (e) => {
                ws.onerror = e;
            },
            open: (e) => {
                ws.onopen = e;
            },
        };
    }
    catch {
        throw new Error('No websockets implemented');
    }
};
export const apiSubscriptionSSE = (options) => (query, variables) => {
    const url = options[0];
    const fetchOptions = options[1] || {};
    let abortController = null;
    let reader = null;
    let onCallback = null;
    let errorCallback = null;
    let openCallback = null;
    let offCallback = null;
    const startStream = async () => {
        try {
            abortController = new AbortController();
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'text/event-stream',
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    ...fetchOptions.headers,
                },
                body: JSON.stringify({ query, variables }),
                signal: abortController.signal,
                ...fetchOptions,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (openCallback) {
                openCallback();
            }
            reader = response.body?.getReader() || null;
            if (!reader) {
                throw new Error('No response body');
            }
            const decoder = new TextDecoder();
            let buffer = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    if (offCallback) {
                        offCallback({ data: null, code: 1000, reason: 'Stream completed' });
                    }
                    break;
                }
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = line.slice(6);
                            const parsed = JSON.parse(data);
                            if (parsed.errors) {
                                if (errorCallback) {
                                    errorCallback({ data: parsed.data, errors: parsed.errors });
                                }
                            }
                            else if (onCallback && parsed.data) {
                                onCallback(parsed.data);
                            }
                        }
                        catch {
                            if (errorCallback) {
                                errorCallback({ errors: ['Failed to parse SSE data'] });
                            }
                        }
                    }
                }
            }
        }
        catch (err) {
            const error = err;
            if (error.name !== 'AbortError' && errorCallback) {
                errorCallback({ errors: [error.message || 'Unknown error'] });
            }
        }
    };
    return {
        on: (e) => {
            onCallback = e;
        },
        off: (e) => {
            offCallback = e;
        },
        error: (e) => {
            errorCallback = e;
        },
        open: (e) => {
            if (e) {
                openCallback = e;
            }
            startStream();
        },
        close: () => {
            if (abortController) {
                abortController.abort();
            }
            if (reader) {
                reader.cancel();
            }
        },
    };
};
const handleFetchResponse = (response) => {
    if (!response.ok) {
        return new Promise((_, reject) => {
            response
                .text()
                .then((text) => {
                try {
                    reject(JSON.parse(text));
                }
                catch (err) {
                    reject(text);
                }
            })
                .catch(reject);
        });
    }
    return response.json();
};
export const apiFetch = (options) => (query, variables = {}) => {
    const fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === 'GET') {
        return fetch(`${options[0]}?query=${encodeURIComponent(query)}`, fetchOptions)
            .then(handleFetchResponse)
            .then((response) => {
            if (response.errors) {
                throw new GraphQLError(response);
            }
            return response.data;
        });
    }
    return fetch(`${options[0]}`, {
        body: JSON.stringify({ query, variables }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        ...fetchOptions,
    })
        .then(handleFetchResponse)
        .then((response) => {
        if (response.errors) {
            throw new GraphQLError(response);
        }
        return response.data;
    });
};
export const InternalsBuildQuery = ({ ops, props, returns, options, scalars, }) => {
    const ibb = (k, o, p = '', root = true, vars = []) => {
        const keyForPath = purifyGraphQLKey(k);
        const newPath = [p, keyForPath].join(SEPARATOR);
        if (!o) {
            return '';
        }
        if (typeof o === 'boolean' || typeof o === 'number') {
            return k;
        }
        if (typeof o === 'string') {
            return `${k} ${o}`;
        }
        if (Array.isArray(o)) {
            const args = InternalArgsBuilt({
                props,
                returns,
                ops,
                scalars,
                vars,
            })(o[0], newPath);
            return `${ibb(args ? `${k}(${args})` : k, o[1], p, false, vars)}`;
        }
        if (k === '__alias') {
            return Object.entries(o)
                .map(([alias, objectUnderAlias]) => {
                if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
                    throw new Error('Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}');
                }
                const operationName = Object.keys(objectUnderAlias)[0];
                const operation = objectUnderAlias[operationName];
                return ibb(`${alias}:${operationName}`, operation, p, false, vars);
            })
                .join('\n');
        }
        const hasOperationName = root && options?.operationName ? ' ' + options.operationName : '';
        const keyForDirectives = o.__directives ?? '';
        const query = `{${Object.entries(o)
            .filter(([k]) => k !== '__directives')
            .map((e) => ibb(...e, [p, `field<>${keyForPath}`].join(SEPARATOR), false, vars))
            .join('\n')}}`;
        if (!root) {
            return `${k} ${keyForDirectives}${hasOperationName} ${query}`;
        }
        const varsString = vars.map((v) => `${v.name}: ${v.graphQLType}`).join(', ');
        return `${k} ${keyForDirectives}${hasOperationName}${varsString ? `(${varsString})` : ''} ${query}`;
    };
    return ibb;
};
export const Thunder = (fn, thunderGraphQLOptions) => (operation, graphqlOptions) => (o, ops) => {
    const options = {
        ...thunderGraphQLOptions,
        ...graphqlOptions,
    };
    return fn(Zeus(operation, o, {
        operationOptions: ops,
        scalars: options?.scalars,
    }), ops?.variables).then((data) => {
        if (options?.scalars) {
            return decodeScalarsInResponse({
                response: data,
                initialOp: operation,
                initialZeusQuery: o,
                returns: ReturnTypes,
                scalars: options.scalars,
                ops: Ops,
            });
        }
        return data;
    });
};
export const Chain = (...options) => Thunder(apiFetch(options));
export const SubscriptionThunder = (fn, thunderGraphQLOptions) => (operation, graphqlOptions) => (o, ops) => {
    const options = {
        ...thunderGraphQLOptions,
        ...graphqlOptions,
    };
    const returnedFunction = fn(Zeus(operation, o, {
        operationOptions: ops,
        scalars: options?.scalars,
    }));
    if (returnedFunction?.on && options?.scalars) {
        const wrapped = returnedFunction.on;
        returnedFunction.on = (fnToCall) => wrapped((data) => {
            if (options?.scalars) {
                return fnToCall(decodeScalarsInResponse({
                    response: data,
                    initialOp: operation,
                    initialZeusQuery: o,
                    returns: ReturnTypes,
                    scalars: options.scalars,
                    ops: Ops,
                }));
            }
            return fnToCall(data);
        });
    }
    return returnedFunction;
};
export const Subscription = (...options) => SubscriptionThunder(apiSubscription(options));
export const SubscriptionThunderSSE = (fn, thunderGraphQLOptions) => (operation, graphqlOptions) => (o, ops) => {
    const options = {
        ...thunderGraphQLOptions,
        ...graphqlOptions,
    };
    const returnedFunction = fn(Zeus(operation, o, {
        operationOptions: ops,
        scalars: options?.scalars,
    }), ops?.variables);
    if (returnedFunction?.on && options?.scalars) {
        const wrapped = returnedFunction.on;
        returnedFunction.on = (fnToCall) => wrapped((data) => {
            if (options?.scalars) {
                return fnToCall(decodeScalarsInResponse({
                    response: data,
                    initialOp: operation,
                    initialZeusQuery: o,
                    returns: ReturnTypes,
                    scalars: options.scalars,
                    ops: Ops,
                }));
            }
            return fnToCall(data);
        });
    }
    return returnedFunction;
};
export const SubscriptionSSE = (...options) => SubscriptionThunderSSE(apiSubscriptionSSE(options));
export const Zeus = (operation, o, ops) => InternalsBuildQuery({
    props: AllTypesProps,
    returns: ReturnTypes,
    ops: Ops,
    options: ops?.operationOptions,
    scalars: ops?.scalars,
})(operation, o);
export const ZeusSelect = () => ((t) => t);
export const Selector = (key) => key && ZeusSelect();
export const TypeFromSelector = (key) => key && ZeusSelect();
export const Gql = Chain(HOST, {
    headers: {
        'Content-Type': 'application/json',
        ...HEADERS,
    },
});
export const ZeusScalars = ZeusSelect();
export const fields = (k) => {
    const t = ReturnTypes[k];
    const fnType = k in AllTypesProps ? AllTypesProps[k] : undefined;
    const hasFnTypes = typeof fnType === 'object' ? fnType : undefined;
    const o = Object.fromEntries(Object.entries(t)
        .filter(([k, value]) => {
        const isFunctionType = hasFnTypes && k in hasFnTypes && !!hasFnTypes[k];
        if (isFunctionType)
            return false;
        const isReturnType = ReturnTypes[value];
        if (!isReturnType)
            return true;
        if (typeof isReturnType !== 'string')
            return false;
        if (isReturnType.startsWith('scalar.')) {
            return true;
        }
        return false;
    })
        .map(([key]) => [key, true]));
    return o;
};
export const decodeScalarsInResponse = ({ response, scalars, returns, ops, initialZeusQuery, initialOp, }) => {
    if (!scalars) {
        return response;
    }
    const builder = PrepareScalarPaths({
        ops,
        returns,
    });
    const scalarPaths = builder(initialOp, ops[initialOp], initialZeusQuery);
    if (scalarPaths) {
        const r = traverseResponse({ scalarPaths, resolvers: scalars })(initialOp, response, [ops[initialOp]]);
        return r;
    }
    return response;
};
export const traverseResponse = ({ resolvers, scalarPaths, }) => {
    const ibb = (k, o, p = []) => {
        if (Array.isArray(o)) {
            return o.map((eachO) => ibb(k, eachO, p));
        }
        if (o == null) {
            return o;
        }
        const scalarPathString = p.join(SEPARATOR);
        const currentScalarString = scalarPaths[scalarPathString];
        if (currentScalarString) {
            const currentDecoder = resolvers[currentScalarString.split('.')[1]]?.decode;
            if (currentDecoder) {
                return currentDecoder(o);
            }
        }
        if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string' || !o) {
            return o;
        }
        const entries = Object.entries(o).map(([k, v]) => [k, ibb(k, v, [...p, purifyGraphQLKey(k)])]);
        const objectFromEntries = entries.reduce((a, [k, v]) => {
            a[k] = v;
            return a;
        }, {});
        return objectFromEntries;
    };
    return ibb;
};
export const SEPARATOR = '|';
export class GraphQLError extends Error {
    response;
    constructor(response) {
        super('');
        this.response = response;
        console.error(response);
    }
    toString() {
        return 'GraphQL Response Error';
    }
}
const ExtractScalar = (mappedParts, returns) => {
    if (mappedParts.length === 0) {
        return;
    }
    const oKey = mappedParts[0];
    const returnP1 = returns[oKey];
    if (typeof returnP1 === 'object') {
        const returnP2 = returnP1[mappedParts[1]];
        if (returnP2) {
            return ExtractScalar([returnP2, ...mappedParts.slice(2)], returns);
        }
        return undefined;
    }
    return returnP1;
};
export const PrepareScalarPaths = ({ ops, returns }) => {
    const ibb = (k, originalKey, o, p = [], pOriginals = [], root = true) => {
        if (!o) {
            return;
        }
        if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string') {
            const extractionArray = [...pOriginals, originalKey];
            const isScalar = ExtractScalar(extractionArray, returns);
            if (isScalar?.startsWith('scalar')) {
                const partOfTree = {
                    [[...p, k].join(SEPARATOR)]: isScalar,
                };
                return partOfTree;
            }
            return {};
        }
        if (Array.isArray(o)) {
            return ibb(k, k, o[1], p, pOriginals, false);
        }
        if (k === '__alias') {
            return Object.entries(o)
                .map(([alias, objectUnderAlias]) => {
                if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
                    throw new Error('Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}');
                }
                const operationName = Object.keys(objectUnderAlias)[0];
                const operation = objectUnderAlias[operationName];
                return ibb(alias, operationName, operation, p, pOriginals, false);
            })
                .reduce((a, b) => ({
                ...a,
                ...b,
            }));
        }
        const keyName = root ? ops[k] : k;
        return Object.entries(o)
            .filter(([k]) => k !== '__directives')
            .map(([k, v]) => {
            const isInlineFragment = originalKey.match(/^...\s*on/) != null;
            return ibb(k, k, v, isInlineFragment ? p : [...p, purifyGraphQLKey(keyName || k)], isInlineFragment ? pOriginals : [...pOriginals, purifyGraphQLKey(originalKey)], false);
        })
            .reduce((a, b) => ({
            ...a,
            ...b,
        }));
    };
    return ibb;
};
export const purifyGraphQLKey = (k) => k.replace(/\([^)]*\)/g, '').replace(/^[^:]*\:/g, '');
const mapPart = (p) => {
    const [isArg, isField] = p.split('<>');
    if (isField) {
        return {
            v: isField,
            __type: 'field',
        };
    }
    return {
        v: isArg,
        __type: 'arg',
    };
};
export const ResolveFromPath = (props, returns, ops) => {
    const ResolvePropsType = (mappedParts) => {
        const oKey = ops[mappedParts[0].v];
        const propsP1 = oKey ? props[oKey] : props[mappedParts[0].v];
        if (propsP1 === 'enum' && mappedParts.length === 1) {
            return 'enum';
        }
        if (typeof propsP1 === 'string' && propsP1.startsWith('scalar.') && mappedParts.length === 1) {
            return propsP1;
        }
        if (typeof propsP1 === 'object') {
            if (mappedParts.length < 2) {
                return 'not';
            }
            const propsP2 = propsP1[mappedParts[1].v];
            if (typeof propsP2 === 'string') {
                return rpp(`${propsP2}${SEPARATOR}${mappedParts
                    .slice(2)
                    .map((mp) => mp.v)
                    .join(SEPARATOR)}`);
            }
            if (typeof propsP2 === 'object') {
                if (mappedParts.length < 3) {
                    return 'not';
                }
                const propsP3 = propsP2[mappedParts[2].v];
                if (propsP3 && mappedParts[2].__type === 'arg') {
                    return rpp(`${propsP3}${SEPARATOR}${mappedParts
                        .slice(3)
                        .map((mp) => mp.v)
                        .join(SEPARATOR)}`);
                }
            }
        }
    };
    const ResolveReturnType = (mappedParts) => {
        if (mappedParts.length === 0) {
            return 'not';
        }
        const oKey = ops[mappedParts[0].v];
        const returnP1 = oKey ? returns[oKey] : returns[mappedParts[0].v];
        if (typeof returnP1 === 'object') {
            if (mappedParts.length < 2)
                return 'not';
            const returnP2 = returnP1[mappedParts[1].v];
            if (returnP2) {
                return rpp(`${returnP2}${SEPARATOR}${mappedParts
                    .slice(2)
                    .map((mp) => mp.v)
                    .join(SEPARATOR)}`);
            }
        }
    };
    const rpp = (path) => {
        const parts = path.split(SEPARATOR).filter((l) => l.length > 0);
        const mappedParts = parts.map(mapPart);
        const propsP1 = ResolvePropsType(mappedParts);
        if (propsP1) {
            return propsP1;
        }
        const returnP1 = ResolveReturnType(mappedParts);
        if (returnP1) {
            return returnP1;
        }
        return 'not';
    };
    return rpp;
};
export const InternalArgsBuilt = ({ props, ops, returns, scalars, vars, }) => {
    const arb = (a, p = '', root = true) => {
        if (typeof a === 'string') {
            if (a.startsWith(START_VAR_NAME)) {
                const [varName, graphQLType] = a.replace(START_VAR_NAME, '$').split(GRAPHQL_TYPE_SEPARATOR);
                const v = vars.find((v) => v.name === varName);
                if (!v) {
                    vars.push({
                        name: varName,
                        graphQLType,
                    });
                }
                else {
                    if (v.graphQLType !== graphQLType) {
                        throw new Error(`Invalid variable exists with two different GraphQL Types, "${v.graphQLType}" and ${graphQLType}`);
                    }
                }
                return varName;
            }
        }
        const checkType = ResolveFromPath(props, returns, ops)(p);
        if (checkType.startsWith('scalar.')) {
            const [_, ...splittedScalar] = checkType.split('.');
            const scalarKey = splittedScalar.join('.');
            return scalars?.[scalarKey]?.encode?.(a) || JSON.stringify(a);
        }
        if (Array.isArray(a)) {
            return `[${a.map((arr) => arb(arr, p, false)).join(', ')}]`;
        }
        if (typeof a === 'string') {
            if (checkType === 'enum') {
                return a;
            }
            return `${JSON.stringify(a)}`;
        }
        if (typeof a === 'object') {
            if (a === null) {
                return `null`;
            }
            const returnedObjectString = Object.entries(a)
                .filter(([, v]) => typeof v !== 'undefined')
                .map(([k, v]) => `${k}: ${arb(v, [p, k].join(SEPARATOR), false)}`)
                .join(',\n');
            if (!root) {
                return `{${returnedObjectString}}`;
            }
            return returnedObjectString;
        }
        return `${a}`;
    };
    return arb;
};
export const resolverFor = (_type, _field, fn) => fn;
export const START_VAR_NAME = `$ZEUS_VAR`;
export const GRAPHQL_TYPE_SEPARATOR = `__$GRAPHQL__`;
export const $ = (name, graphqlType) => {
    return (START_VAR_NAME + name + GRAPHQL_TYPE_SEPARATOR + graphqlType);
};
//# sourceMappingURL=index.js.map