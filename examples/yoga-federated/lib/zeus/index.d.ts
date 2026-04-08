import { Ops } from './const';
export declare const HOST = "Specify host";
export declare const HEADERS: {};
export declare const apiSubscription: (options: chainOptions) => (query: string) => {
    ws: WebSocket;
    on: (e: (args: any) => void) => void;
    off: (e: (args: any) => void) => void;
    error: (e: (args: any) => void) => void;
    open: (e: () => void) => void;
};
export declare const apiSubscriptionSSE: (options: chainOptions) => (query: string, variables?: Record<string, unknown>) => {
    on: (e: (args: unknown) => void) => void;
    off: (e: (args: unknown) => void) => void;
    error: (e: (args: unknown) => void) => void;
    open: (e?: () => void) => void;
    close: () => void;
};
export declare const apiFetch: (options: fetchOptions) => (query: string, variables?: Record<string, unknown>) => Promise<Record<string, any> | undefined>;
export declare const InternalsBuildQuery: ({ ops, props, returns, options, scalars, }: {
    props: AllTypesPropsType;
    returns: ReturnTypesType;
    ops: Operations;
    options?: OperationOptions;
    scalars?: ScalarDefinition;
}) => (k: string, o: InputValueType | VType, p?: string, root?: boolean, vars?: Array<{
    name: string;
    graphQLType: string;
}>) => string;
type UnionOverrideKeys<T, U> = Omit<T, keyof U> & U;
export declare const Thunder: <SCLR extends ScalarDefinition>(fn: FetchFunction, thunderGraphQLOptions?: ThunderGraphQLOptions<SCLR>) => <O extends keyof typeof Ops, OVERRIDESCLR extends SCLR, R extends keyof ValueTypes = GenericOperation<O>>(operation: O, graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR>) => <Z extends ValueTypes[R]>(o: Z & { [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never; }, ops?: OperationOptions & {
    variables?: Record<string, unknown>;
}) => Promise<InputType<GraphQLTypes[R], Z, UnionOverrideKeys<SCLR, OVERRIDESCLR>>>;
export declare const Chain: (...options: chainOptions) => <O extends keyof typeof Ops, OVERRIDESCLR extends ScalarDefinition, R extends keyof ValueTypes = GenericOperation<O>>(operation: O, graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR> | undefined) => <Z extends ValueTypes[R]>(o: Z & { [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never; }, ops?: OperationOptions & {
    variables?: Record<string, unknown>;
}) => Promise<InputType<GraphQLTypes[R], Z, UnionOverrideKeys<ScalarDefinition, OVERRIDESCLR>>>;
export declare const SubscriptionThunder: <SCLR extends ScalarDefinition>(fn: SubscriptionFunction, thunderGraphQLOptions?: ThunderGraphQLOptions<SCLR>) => <O extends keyof typeof Ops, OVERRIDESCLR extends SCLR, R extends keyof ValueTypes = GenericOperation<O>>(operation: O, graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR>) => <Z extends ValueTypes[R]>(o: Z & { [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never; }, ops?: OperationOptions & {
    variables?: Record<string, unknown>;
}) => SubscriptionToGraphQL<Z, GraphQLTypes[R], UnionOverrideKeys<SCLR, OVERRIDESCLR>>;
export declare const Subscription: (...options: chainOptions) => <O extends keyof typeof Ops, OVERRIDESCLR extends ScalarDefinition, R extends keyof ValueTypes = GenericOperation<O>>(operation: O, graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR> | undefined) => <Z extends ValueTypes[R]>(o: Z & { [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never; }, ops?: OperationOptions & {
    variables?: Record<string, unknown>;
}) => SubscriptionToGraphQL<Z, GraphQLTypes[R], UnionOverrideKeys<ScalarDefinition, OVERRIDESCLR>>;
export type SubscriptionToGraphQLSSE<Z, T, SCLR extends ScalarDefinition> = {
    on: (fn: (args: InputType<T, Z, SCLR>) => void) => void;
    off: (fn: (e: {
        data?: InputType<T, Z, SCLR>;
        code?: number;
        reason?: string;
        message?: string;
    }) => void) => void;
    error: (fn: (e: {
        data?: InputType<T, Z, SCLR>;
        errors?: string[];
    }) => void) => void;
    open: (fn?: () => void) => void;
    close: () => void;
};
export declare const SubscriptionThunderSSE: <SCLR extends ScalarDefinition>(fn: SubscriptionFunction, thunderGraphQLOptions?: ThunderGraphQLOptions<SCLR>) => <O extends keyof typeof Ops, OVERRIDESCLR extends SCLR, R extends keyof ValueTypes = GenericOperation<O>>(operation: O, graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR>) => <Z extends ValueTypes[R]>(o: Z & { [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never; }, ops?: OperationOptions & {
    variables?: Record<string, unknown>;
}) => SubscriptionToGraphQLSSE<Z, GraphQLTypes[R], UnionOverrideKeys<SCLR, OVERRIDESCLR>>;
export declare const SubscriptionSSE: (...options: chainOptions) => <O extends keyof typeof Ops, OVERRIDESCLR extends ScalarDefinition, R extends keyof ValueTypes = GenericOperation<O>>(operation: O, graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR> | undefined) => <Z extends ValueTypes[R]>(o: Z & { [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never; }, ops?: OperationOptions & {
    variables?: Record<string, unknown>;
}) => SubscriptionToGraphQLSSE<Z, GraphQLTypes[R], UnionOverrideKeys<ScalarDefinition, OVERRIDESCLR>>;
export declare const Zeus: <Z extends ValueTypes[R], O extends keyof typeof Ops, R extends keyof ValueTypes = GenericOperation<O>>(operation: O, o: Z, ops?: {
    operationOptions?: OperationOptions;
    scalars?: ScalarDefinition;
}) => string;
export declare const ZeusSelect: <T>() => SelectionFunction<T>;
export declare const Selector: <T extends keyof ValueTypes>(key: T) => SelectionFunction<ValueTypes[T]>;
export declare const TypeFromSelector: <T extends keyof ValueTypes>(key: T) => SelectionFunction<ValueTypes[T]>;
export declare const Gql: <O extends keyof typeof Ops, OVERRIDESCLR extends ScalarDefinition, R extends keyof ValueTypes = GenericOperation<O>>(operation: O, graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR> | undefined) => <Z extends ValueTypes[R]>(o: Z & { [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never; }, ops?: OperationOptions & {
    variables?: Record<string, unknown>;
}) => Promise<InputType<GraphQLTypes[R], Z, UnionOverrideKeys<ScalarDefinition, OVERRIDESCLR>>>;
export declare const ZeusScalars: SelectionFunction<ScalarCoders>;
type BaseSymbol = number | string | undefined | boolean | null;
type ScalarsSelector<T, V> = {
    [X in Required<{
        [P in keyof T]: P extends keyof V ? V[P] extends Array<any> | undefined ? never : T[P] extends BaseSymbol | Array<BaseSymbol> ? P : never : never;
    }>[keyof T]]: true;
};
export declare const fields: <T extends keyof ModelTypes>(k: T) => ScalarsSelector<ModelTypes[T], T extends keyof ValueTypes ? ValueTypes[T] : never>;
export declare const decodeScalarsInResponse: <O extends Operations>({ response, scalars, returns, ops, initialZeusQuery, initialOp, }: {
    ops: O;
    response: any;
    returns: ReturnTypesType;
    scalars?: Record<string, ScalarResolver | undefined>;
    initialOp: keyof O;
    initialZeusQuery: InputValueType | VType;
}) => any;
export declare const traverseResponse: ({ resolvers, scalarPaths, }: {
    scalarPaths: {
        [x: string]: `scalar.${string}`;
    };
    resolvers: {
        [x: string]: ScalarResolver | undefined;
    };
}) => (k: string, o: InputValueType | VType, p?: string[]) => unknown;
export type AllTypesPropsType = {
    [x: string]: undefined | `scalar.${string}` | 'enum' | {
        [x: string]: undefined | string | {
            [x: string]: string | undefined;
        };
    };
};
export type ReturnTypesType = {
    [x: string]: {
        [x: string]: string | undefined;
    } | `scalar.${string}` | undefined;
};
export type InputValueType = {
    [x: string]: undefined | boolean | string | number | [any, undefined | boolean | InputValueType] | InputValueType;
};
export type VType = undefined | boolean | string | number | [any, undefined | boolean | InputValueType] | InputValueType;
export type PlainType = boolean | number | string | null | undefined;
export type ZeusArgsType = PlainType | {
    [x: string]: ZeusArgsType;
} | Array<ZeusArgsType>;
export type Operations = Record<string, string>;
export type VariableDefinition = {
    [x: string]: unknown;
};
export declare const SEPARATOR = "|";
export type fetchOptions = Parameters<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (...args: infer R) => WebSocket ? R : never;
export type chainOptions = [fetchOptions[0], fetchOptions[1] & {
    websocket?: websocketOptions;
}] | [fetchOptions[0]];
export type FetchFunction = (query: string, variables?: Record<string, unknown>) => Promise<any>;
export type SubscriptionFunction = (query: string, variables?: Record<string, unknown>) => any;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;
export type OperationOptions = {
    operationName?: string;
};
export type ScalarCoder = Record<string, (s: unknown) => string>;
export interface GraphQLResponse {
    data?: Record<string, any>;
    errors?: Array<{
        message: string;
    }>;
}
export declare class GraphQLError extends Error {
    response: GraphQLResponse;
    constructor(response: GraphQLResponse);
    toString(): string;
}
export type GenericOperation<O> = O extends keyof typeof Ops ? typeof Ops[O] : never;
export type ThunderGraphQLOptions<SCLR extends ScalarDefinition> = {
    scalars?: SCLR | ScalarCoders;
};
export declare const PrepareScalarPaths: ({ ops, returns }: {
    returns: ReturnTypesType;
    ops: Operations;
}) => (k: string, originalKey: string, o: InputValueType | VType, p?: string[], pOriginals?: string[], root?: boolean) => {
    [x: string]: `scalar.${string}`;
} | undefined;
export declare const purifyGraphQLKey: (k: string) => string;
export declare const ResolveFromPath: (props: AllTypesPropsType, returns: ReturnTypesType, ops: Operations) => (path: string) => "enum" | "not" | `scalar.${string}`;
export declare const InternalArgsBuilt: ({ props, ops, returns, scalars, vars, }: {
    props: AllTypesPropsType;
    returns: ReturnTypesType;
    ops: Operations;
    scalars?: ScalarDefinition;
    vars: Array<{
        name: string;
        graphQLType: string;
    }>;
}) => (a: ZeusArgsType, p?: string, root?: boolean) => string;
export declare const resolverFor: <X, T extends keyof ResolverInputTypes, Z extends keyof ResolverInputTypes[T]>(_type: T, _field: Z, fn: (args: Required<ResolverInputTypes[T]>[Z] extends [infer Input, any] ? Input : any, source: any) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> | X : never) => (args?: any, source?: any) => ReturnType<typeof fn>;
export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<UnwrapPromise<ReturnType<T>>>;
export type ZeusHook<T extends (...args: any[]) => Record<string, (...args: any[]) => Promise<any>>, N extends keyof ReturnType<T>> = ZeusState<ReturnType<T>[N]>;
export type WithTypeNameValue<T> = T & {
    __typename?: boolean;
    __directives?: string;
};
export type AliasType<T> = WithTypeNameValue<T> & {
    __alias?: Record<string, WithTypeNameValue<T>>;
};
type DeepAnify<T> = {
    [P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
export type ScalarDefinition = Record<string, ScalarResolver>;
type IsScalar<S, SCLR extends ScalarDefinition> = S extends 'scalar' & {
    name: infer T;
} ? T extends keyof SCLR ? SCLR[T]['decode'] extends (s: unknown) => unknown ? ReturnType<SCLR[T]['decode']> : unknown : unknown : S extends Array<infer R> ? Array<IsScalar<R, SCLR>> : S;
type IsArray<T, U, SCLR extends ScalarDefinition> = T extends Array<infer R> ? InputType<R, U, SCLR>[] : InputType<T, U, SCLR>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;
type BaseZeusResolver = boolean | 1 | string | Variable<any, string>;
type IsInterfaced<SRC extends DeepAnify<DST>, DST, SCLR extends ScalarDefinition> = FlattenArray<SRC> extends ZEUS_INTERFACES | ZEUS_UNIONS ? {
    [P in keyof SRC]: SRC[P] extends '__union' & infer R ? P extends keyof DST ? IsArray<R, '__typename' extends keyof DST ? DST[P] & {
        __typename: true;
    } : DST[P], SCLR> : IsArray<R, '__typename' extends keyof DST ? {
        __typename: true;
    } : Record<string, never>, SCLR> : never;
}[keyof SRC] & {
    [P in keyof Omit<Pick<SRC, {
        [P in keyof DST]: SRC[P] extends '__union' & infer _R ? never : P;
    }[keyof DST]>, '__typename'>]: IsPayLoad<DST[P]> extends BaseZeusResolver ? IsScalar<SRC[P], SCLR> : IsArray<SRC[P], DST[P], SCLR>;
} : {
    [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<DST[P]> extends BaseZeusResolver ? IsScalar<SRC[P], SCLR> : IsArray<SRC[P], DST[P], SCLR>;
};
export type MapType<SRC, DST, SCLR extends ScalarDefinition> = SRC extends DeepAnify<DST> ? IsInterfaced<SRC, DST, SCLR> : never;
export type InputType<SRC, DST, SCLR extends ScalarDefinition = {}> = IsPayLoad<DST> extends {
    __alias: infer R;
} ? {
    [P in keyof R]: MapType<SRC, R[P], SCLR>[keyof MapType<SRC, R[P], SCLR>];
} & MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>, SCLR> : MapType<SRC, IsPayLoad<DST>, SCLR>;
export type SubscriptionToGraphQL<Z, T, SCLR extends ScalarDefinition> = {
    ws: WebSocket;
    on: (fn: (args: InputType<T, Z, SCLR>) => void) => void;
    off: (fn: (e: {
        data?: InputType<T, Z, SCLR>;
        code?: number;
        reason?: string;
        message?: string;
    }) => void) => void;
    error: (fn: (e: {
        data?: InputType<T, Z, SCLR>;
        errors?: string[];
    }) => void) => void;
    open: () => void;
};
export type FromSelector<SELECTOR, NAME extends keyof GraphQLTypes, SCLR extends ScalarDefinition = {}> = InputType<GraphQLTypes[NAME], SELECTOR, SCLR>;
export type ScalarResolver = {
    encode?: (s: unknown) => string;
    decode?: (s: unknown) => unknown;
};
export type SelectionFunction<V> = <Z extends V>(t: Z & {
    [P in keyof Z]: P extends keyof V ? Z[P] : never;
}) => Z;
type BuiltInVariableTypes = {
    ['String']: string;
    ['Int']: number;
    ['Float']: number;
    ['Boolean']: boolean;
};
type AllVariableTypes = keyof BuiltInVariableTypes | keyof ZEUS_VARIABLES;
type VariableRequired<T extends string> = `${T}!` | T | `[${T}]` | `[${T}]!` | `[${T}!]` | `[${T}!]!`;
type VR<T extends string> = VariableRequired<VariableRequired<T>>;
export type GraphQLVariableType = VR<AllVariableTypes>;
type ExtractVariableTypeString<T extends string> = T extends VR<infer R1> ? R1 extends VR<infer R2> ? R2 extends VR<infer R3> ? R3 extends VR<infer R4> ? R4 extends VR<infer R5> ? R5 : R4 : R3 : R2 : R1 : T;
type DecomposeType<T, Type> = T extends `[${infer R}]` ? Array<DecomposeType<R, Type>> | undefined : T extends `${infer R}!` ? NonNullable<DecomposeType<R, Type>> : Type | undefined;
type ExtractTypeFromGraphQLType<T extends string> = T extends keyof ZEUS_VARIABLES ? ZEUS_VARIABLES[T] : T extends keyof BuiltInVariableTypes ? BuiltInVariableTypes[T] : any;
export type GetVariableType<T extends string> = DecomposeType<T, ExtractTypeFromGraphQLType<ExtractVariableTypeString<T>>>;
type UndefinedKeys<T> = {
    [K in keyof T]-?: T[K] extends NonNullable<T[K]> ? never : K;
}[keyof T];
type WithNullableKeys<T> = Pick<T, UndefinedKeys<T>>;
type WithNonNullableKeys<T> = Omit<T, UndefinedKeys<T>>;
type OptionalKeys<T> = {
    [P in keyof T]?: T[P];
};
export type WithOptionalNullables<T> = OptionalKeys<WithNullableKeys<T>> & WithNonNullableKeys<T>;
export type ComposableSelector<T extends keyof ValueTypes> = ReturnType<SelectionFunction<ValueTypes[T]>>;
export type Variable<T extends GraphQLVariableType, Name extends string> = {
    ' __zeus_name': Name;
    ' __zeus_type': T;
};
export type ExtractVariablesDeep<Query> = Query extends Variable<infer VType, infer VName> ? {
    [key in VName]: GetVariableType<VType>;
} : Query extends string | number | boolean | Array<string | number | boolean> ? {} : UnionToIntersection<{
    [K in keyof Query]: WithOptionalNullables<ExtractVariablesDeep<Query[K]>>;
}[keyof Query]>;
export type ExtractVariables<Query> = Query extends Variable<infer VType, infer VName> ? {
    [key in VName]: GetVariableType<VType>;
} : Query extends [infer Inputs, infer Outputs] ? ExtractVariablesDeep<Inputs> & ExtractVariables<Outputs> : Query extends string | number | boolean | Array<string | number | boolean> ? {} : UnionToIntersection<{
    [K in keyof Query]: WithOptionalNullables<ExtractVariables<Query[K]>>;
}[keyof Query]>;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export declare const START_VAR_NAME = "$ZEUS_VAR";
export declare const GRAPHQL_TYPE_SEPARATOR = "__$GRAPHQL__";
export declare const $: <Type extends GraphQLVariableType, Name extends string>(name: Name, graphqlType: Type) => Variable<Type, Name>;
type ZEUS_INTERFACES = never;
export type ScalarCoders = {
    Secret?: ScalarResolver;
    ID?: ScalarResolver;
};
type ZEUS_UNIONS = never;
export type ValueTypes = {
    ["Todo"]: AliasType<{
        _id?: boolean | `@${string}`;
        content?: boolean | `@${string}`;
        done?: boolean | `@${string}`;
        __typename?: boolean | `@${string}`;
        ['...on Todo']?: Omit<ValueTypes["Todo"], "...on Todo">;
    }>;
    ["TodoOps"]: AliasType<{
        markDone?: boolean | `@${string}`;
        __typename?: boolean | `@${string}`;
        ['...on TodoOps']?: Omit<ValueTypes["TodoOps"], "...on TodoOps">;
    }>;
    ["Secret"]: unknown;
    ["User"]: AliasType<{
        _id?: boolean | `@${string}`;
        username?: boolean | `@${string}`;
        __typename?: boolean | `@${string}`;
        ['...on User']?: Omit<ValueTypes["User"], "...on User">;
    }>;
    ["AuthorizedUserMutation"]: AliasType<{
        createTodo?: [{
            content: string | Variable<any, string>;
            secret?: ValueTypes["Secret"] | undefined | null | Variable<any, string>;
        }, boolean | `@${string}`];
        todoOps?: [{
            _id: string | Variable<any, string>;
        }, ValueTypes["TodoOps"]];
        changePassword?: [{
            newPassword: string | Variable<any, string>;
        }, boolean | `@${string}`];
        __typename?: boolean | `@${string}`;
        ['...on AuthorizedUserMutation']?: Omit<ValueTypes["AuthorizedUserMutation"], "...on AuthorizedUserMutation">;
    }>;
    ["AuthorizedUserQuery"]: AliasType<{
        todos?: ValueTypes["Todo"];
        todo?: [{
            _id: string | Variable<any, string>;
        }, ValueTypes["Todo"]];
        me?: ValueTypes["User"];
        __typename?: boolean | `@${string}`;
        ['...on AuthorizedUserQuery']?: Omit<ValueTypes["AuthorizedUserQuery"], "...on AuthorizedUserQuery">;
    }>;
    ["Query"]: AliasType<{
        user?: ValueTypes["AuthorizedUserQuery"];
        __typename?: boolean | `@${string}`;
        ['...on Query']?: Omit<ValueTypes["Query"], "...on Query">;
    }>;
    ["Mutation"]: AliasType<{
        user?: ValueTypes["AuthorizedUserMutation"];
        login?: [{
            username: string | Variable<any, string>;
            password: string | Variable<any, string>;
        }, boolean | `@${string}`];
        register?: [{
            username: string | Variable<any, string>;
            password: string | Variable<any, string>;
        }, boolean | `@${string}`];
        __typename?: boolean | `@${string}`;
        ['...on Mutation']?: Omit<ValueTypes["Mutation"], "...on Mutation">;
    }>;
    ["Subscription"]: AliasType<{
        countdown?: [{
            from?: number | undefined | null | Variable<any, string>;
        }, boolean | `@${string}`];
        __typename?: boolean | `@${string}`;
        ['...on Subscription']?: Omit<ValueTypes["Subscription"], "...on Subscription">;
    }>;
    ["ID"]: unknown;
};
export type ResolverInputTypes = {
    ["Todo"]: AliasType<{
        _id?: boolean | `@${string}`;
        content?: boolean | `@${string}`;
        done?: boolean | `@${string}`;
        __typename?: boolean | `@${string}`;
    }>;
    ["TodoOps"]: AliasType<{
        markDone?: boolean | `@${string}`;
        __typename?: boolean | `@${string}`;
    }>;
    ["Secret"]: unknown;
    ["User"]: AliasType<{
        _id?: boolean | `@${string}`;
        username?: boolean | `@${string}`;
        __typename?: boolean | `@${string}`;
    }>;
    ["AuthorizedUserMutation"]: AliasType<{
        createTodo?: [{
            content: string;
            secret?: ResolverInputTypes["Secret"] | undefined | null;
        }, boolean | `@${string}`];
        todoOps?: [{
            _id: string;
        }, ResolverInputTypes["TodoOps"]];
        changePassword?: [{
            newPassword: string;
        }, boolean | `@${string}`];
        __typename?: boolean | `@${string}`;
    }>;
    ["AuthorizedUserQuery"]: AliasType<{
        todos?: ResolverInputTypes["Todo"];
        todo?: [{
            _id: string;
        }, ResolverInputTypes["Todo"]];
        me?: ResolverInputTypes["User"];
        __typename?: boolean | `@${string}`;
    }>;
    ["Query"]: AliasType<{
        user?: ResolverInputTypes["AuthorizedUserQuery"];
        __typename?: boolean | `@${string}`;
    }>;
    ["Mutation"]: AliasType<{
        user?: ResolverInputTypes["AuthorizedUserMutation"];
        login?: [{
            username: string;
            password: string;
        }, boolean | `@${string}`];
        register?: [{
            username: string;
            password: string;
        }, boolean | `@${string}`];
        __typename?: boolean | `@${string}`;
    }>;
    ["Subscription"]: AliasType<{
        countdown?: [{
            from?: number | undefined | null;
        }, boolean | `@${string}`];
        __typename?: boolean | `@${string}`;
    }>;
    ["schema"]: AliasType<{
        query?: ResolverInputTypes["Query"];
        mutation?: ResolverInputTypes["Mutation"];
        subscription?: ResolverInputTypes["Subscription"];
        __typename?: boolean | `@${string}`;
    }>;
    ["ID"]: unknown;
};
export type ModelTypes = {
    ["Todo"]: {
        _id: string;
        content: string;
        done?: boolean | undefined | null;
    };
    ["TodoOps"]: {
        markDone?: boolean | undefined | null;
    };
    ["Secret"]: any;
    ["User"]: {
        _id: string;
        username: string;
    };
    ["AuthorizedUserMutation"]: {
        createTodo: string;
        todoOps: ModelTypes["TodoOps"];
        changePassword?: boolean | undefined | null;
    };
    ["AuthorizedUserQuery"]: {
        todos?: Array<ModelTypes["Todo"]> | undefined | null;
        todo: ModelTypes["Todo"];
        me: ModelTypes["User"];
    };
    ["Query"]: {
        user?: ModelTypes["AuthorizedUserQuery"] | undefined | null;
    };
    ["Mutation"]: {
        user?: ModelTypes["AuthorizedUserMutation"] | undefined | null;
        login: string;
        register: string;
    };
    ["Subscription"]: {
        countdown?: number | undefined | null;
    };
    ["schema"]: {
        query?: ModelTypes["Query"] | undefined | null;
        mutation?: ModelTypes["Mutation"] | undefined | null;
        subscription?: ModelTypes["Subscription"] | undefined | null;
    };
    ["ID"]: any;
};
export type GraphQLTypes = {
    ["Todo"]: {
        __typename: "Todo";
        _id: string;
        content: string;
        done?: boolean | undefined | null;
        ['...on Todo']: Omit<GraphQLTypes["Todo"], "...on Todo">;
    };
    ["TodoOps"]: {
        __typename: "TodoOps";
        markDone?: boolean | undefined | null;
        ['...on TodoOps']: Omit<GraphQLTypes["TodoOps"], "...on TodoOps">;
    };
    ["Secret"]: "scalar" & {
        name: "Secret";
    };
    ["User"]: {
        __typename: "User";
        _id: string;
        username: string;
        ['...on User']: Omit<GraphQLTypes["User"], "...on User">;
    };
    ["AuthorizedUserMutation"]: {
        __typename: "AuthorizedUserMutation";
        createTodo: string;
        todoOps: GraphQLTypes["TodoOps"];
        changePassword?: boolean | undefined | null;
        ['...on AuthorizedUserMutation']: Omit<GraphQLTypes["AuthorizedUserMutation"], "...on AuthorizedUserMutation">;
    };
    ["AuthorizedUserQuery"]: {
        __typename: "AuthorizedUserQuery";
        todos?: Array<GraphQLTypes["Todo"]> | undefined | null;
        todo: GraphQLTypes["Todo"];
        me: GraphQLTypes["User"];
        ['...on AuthorizedUserQuery']: Omit<GraphQLTypes["AuthorizedUserQuery"], "...on AuthorizedUserQuery">;
    };
    ["Query"]: {
        __typename: "Query";
        user?: GraphQLTypes["AuthorizedUserQuery"] | undefined | null;
        ['...on Query']: Omit<GraphQLTypes["Query"], "...on Query">;
    };
    ["Mutation"]: {
        __typename: "Mutation";
        user?: GraphQLTypes["AuthorizedUserMutation"] | undefined | null;
        login: string;
        register: string;
        ['...on Mutation']: Omit<GraphQLTypes["Mutation"], "...on Mutation">;
    };
    ["Subscription"]: {
        __typename: "Subscription";
        countdown?: number | undefined | null;
        ['...on Subscription']: Omit<GraphQLTypes["Subscription"], "...on Subscription">;
    };
    ["ID"]: "scalar" & {
        name: "ID";
    };
};
type ZEUS_VARIABLES = {
    ["Secret"]: ValueTypes["Secret"];
    ["ID"]: ValueTypes["ID"];
};
export {};
