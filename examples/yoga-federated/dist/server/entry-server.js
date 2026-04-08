import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect, useRef, StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { Navigate, useLocation, Link, Outlet, Routes, Route, StaticRouter } from "react-router";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
function ErrorMessage({ message }) {
  if (!message) return null;
  return /* @__PURE__ */ jsx("div", { className: "bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-200 text-sm", children: message });
}
function AuthForm({ onSubmit, isLoading, error }) {
  const [authMode, setAuthMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(authMode, username, password);
    if (success) {
      setUsername("");
      setPassword("");
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md w-full border border-white/20", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-white mb-2 text-center", children: "Axolotl Todo" }),
    /* @__PURE__ */ jsx("p", { className: "text-emerald-200 text-center mb-8", children: "Vite + React + GraphQL + Zeus" }),
    /* @__PURE__ */ jsx(ErrorMessage, { message: error }),
    /* @__PURE__ */ jsxs("div", { className: "flex mb-6", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setAuthMode("login"),
          className: `flex-1 py-2 text-center rounded-l-lg transition-colors ${authMode === "login" ? "bg-emerald-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`,
          children: "Login"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setAuthMode("register"),
          className: `flex-1 py-2 text-center rounded-r-lg transition-colors ${authMode === "register" ? "bg-emerald-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`,
          children: "Register"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: username,
          onChange: (e) => setUsername(e.target.value),
          placeholder: "Username",
          className: "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500",
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          placeholder: "Password",
          className: "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500",
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: isLoading,
          className: "w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-medium py-3 px-4 rounded-lg transition-colors",
          children: isLoading ? "Loading..." : authMode === "login" ? "Login" : "Register"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-white/40 text-xs text-center mt-8", children: [
      "GraphQL endpoint: ",
      /* @__PURE__ */ jsx("code", { className: "text-emerald-300", children: "/graphql" })
    ] })
  ] }) });
}
function Header({ user, onLogout }) {
  return /* @__PURE__ */ jsx("div", { className: "bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white", children: "Axolotl Todo" }),
      /* @__PURE__ */ jsxs("p", { className: "text-emerald-200 text-sm", children: [
        "Welcome, ",
        user == null ? void 0 : user.username
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onLogout,
        className: "bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors",
        children: "Logout"
      }
    )
  ] }) });
}
function TodoForm({ onSubmit, isLoading }) {
  const [content, setContent] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const success = await onSubmit(content);
    if (success) {
      setContent("");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 mb-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Add New Todo" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: content,
          onChange: (e) => setContent(e.target.value),
          placeholder: "What needs to be done?",
          className: "flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: isLoading || !content.trim(),
          className: "bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-medium py-3 px-6 rounded-lg transition-colors",
          children: "Add"
        }
      )
    ] })
  ] });
}
function TodoItem({ todo, onMarkDone, isLoading }) {
  return /* @__PURE__ */ jsxs(
    "li",
    {
      className: `flex items-center gap-3 p-4 rounded-xl transition-colors ${todo.done ? "bg-emerald-500/20" : "bg-white/5 hover:bg-white/10"}`,
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => !todo.done && onMarkDone(todo._id),
            disabled: !!todo.done || isLoading,
            className: `w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${todo.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/30 hover:border-emerald-500"}`,
            children: todo.done && /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) })
          }
        ),
        /* @__PURE__ */ jsx("span", { className: `flex-1 ${todo.done ? "text-emerald-300 line-through" : "text-white"}`, children: todo.content }),
        todo.done && /* @__PURE__ */ jsx("span", { className: "text-emerald-400 text-xs font-medium px-2 py-1 bg-emerald-500/20 rounded", children: "Done" })
      ]
    }
  );
}
function TodoList({ todos, onMarkDone, isLoading }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold text-white mb-4", children: [
      "Your Todos (",
      todos.length,
      ")"
    ] }),
    isLoading && todos.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-white/50 text-center py-8", children: "Loading..." }) : todos.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-white/50 text-center py-8", children: "No todos yet. Create one above!" }) : /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: todos.map((todo) => /* @__PURE__ */ jsx(TodoItem, { todo, onMarkDone, isLoading }, todo._id)) })
  ] });
}
const getStorage = () => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {
      },
      removeItem: () => {
      }
    };
  }
  return localStorage;
};
const useAuthStore = create()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      logout: () => set({ token: null, user: null, error: null })
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => getStorage()),
      partialize: (state) => ({ token: state.token })
    }
  )
);
const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type = "info", duration = 4e3) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }]
    }));
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, duration);
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));
const toast = {
  success: (message, duration) => useToastStore.getState().addToast(message, "success", duration),
  error: (message, duration) => useToastStore.getState().addToast(message, "error", duration),
  info: (message, duration) => useToastStore.getState().addToast(message, "info", duration)
};
const toastStyles = {
  success: "bg-emerald-500/90 border-emerald-400",
  error: "bg-red-500/90 border-red-400",
  info: "bg-cyan-500/90 border-cyan-400"
};
const toastIcons = {
  success: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
  error: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }),
  info: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    }
  ) })
};
function ToastItem({ toast: toast2 }) {
  const removeToast = useToastStore((state) => state.removeToast);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex items-center gap-3 px-4 py-3 rounded-lg border text-white shadow-lg backdrop-blur-sm animate-slide-in ${toastStyles[toast2.type]}`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "flex-shrink-0", children: toastIcons[toast2.type] }),
        /* @__PURE__ */ jsx("p", { className: "flex-1 text-sm font-medium", children: toast2.message }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => removeToast(toast2.id),
            className: "flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity",
            "aria-label": "Dismiss",
            children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        )
      ]
    }
  );
}
function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  if (toasts.length === 0) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm", children: toasts.map((toast2) => /* @__PURE__ */ jsx(ToastItem, { toast: toast2 }, toast2.id)) });
}
const AllTypesProps = {
  Secret: `scalar.Secret`,
  TodoUpdateType: "enum",
  AuthorizedUserMutation: {
    createTodo: {
      secret: "Secret"
    },
    todoOps: {},
    changePassword: {}
  },
  AuthorizedUserQuery: {
    todo: {}
  },
  Subscription: {
    todoUpdates: {},
    countdown: {},
    aiChat: {
      messages: "AIChatMessage"
    }
  },
  Mutation: {
    login: {},
    register: {}
  },
  AIChatMessage: {},
  ID: `scalar.ID`
};
const ReturnTypes = {
  Todo: {
    _id: "String",
    content: "String",
    done: "Boolean"
  },
  TodoOps: {
    markDone: "Boolean"
  },
  Secret: `scalar.Secret`,
  TodoUpdate: {
    type: "TodoUpdateType",
    todo: "Todo"
  },
  User: {
    _id: "String",
    username: "String"
  },
  AuthorizedUserMutation: {
    createTodo: "String",
    todoOps: "TodoOps",
    changePassword: "Boolean"
  },
  AuthorizedUserQuery: {
    todos: "Todo",
    todo: "Todo",
    me: "User"
  },
  resolver: {},
  Query: {
    user: "AuthorizedUserQuery"
  },
  Subscription: {
    todoUpdates: "TodoUpdate",
    countdown: "Int",
    aiChat: "AIChatChunk"
  },
  Mutation: {
    user: "AuthorizedUserMutation",
    login: "String",
    register: "String"
  },
  AIChatChunk: {
    content: "String",
    done: "Boolean"
  },
  ID: `scalar.ID`
};
const Ops = {
  query: "Query",
  mutation: "Mutation",
  subscription: "Subscription"
};
const apiSubscriptionSSE = (options) => (query2, variables) => {
  const url = options[0];
  const fetchOptions = options[1] || {};
  let abortController = null;
  let reader = null;
  let onCallback = null;
  let errorCallback = null;
  let openCallback = null;
  let offCallback = null;
  let isClosing = false;
  const startStream = async () => {
    var _a;
    try {
      abortController = new AbortController();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          ...fetchOptions.headers
        },
        body: JSON.stringify({ query: query2, variables }),
        signal: abortController.signal,
        ...fetchOptions
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (openCallback) {
        openCallback();
      }
      reader = ((_a = response.body) == null ? void 0 : _a.getReader()) || null;
      if (!reader) {
        throw new Error("No response body");
      }
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (offCallback) {
            offCallback({ data: null, code: 1e3, reason: "Stream completed" });
          }
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = line.slice(6);
              const parsed = JSON.parse(data);
              if (parsed.errors) {
                if (errorCallback) {
                  errorCallback({ data: parsed.data, errors: parsed.errors });
                }
              } else if (onCallback && parsed.data) {
                onCallback(parsed.data);
              }
            } catch {
              if (errorCallback) {
                errorCallback({ errors: ["Failed to parse SSE data"] });
              }
            }
          }
        }
      }
    } catch (err) {
      const error = err;
      if (error.name !== "AbortError" && !isClosing && errorCallback) {
        errorCallback({ errors: [error.message || "Unknown error"] });
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
      isClosing = true;
      if (abortController) {
        abortController.abort();
      }
      if (reader) {
        reader.cancel().catch(() => {
        });
      }
    }
  };
};
const handleFetchResponse = (response) => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response.text().then((text) => {
        try {
          reject(JSON.parse(text));
        } catch (err) {
          reject(text);
        }
      }).catch(reject);
    });
  }
  return response.json();
};
const apiFetch = (options) => (query2, variables = {}) => {
  const fetchOptions = options[1] || {};
  if (fetchOptions.method && fetchOptions.method === "GET") {
    return fetch(`${options[0]}?query=${encodeURIComponent(query2)}`, fetchOptions).then(handleFetchResponse).then((response) => {
      if (response.errors) {
        throw new GraphQLError(response);
      }
      return response.data;
    });
  }
  return fetch(`${options[0]}`, {
    body: JSON.stringify({ query: query2, variables }),
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    ...fetchOptions
  }).then(handleFetchResponse).then((response) => {
    if (response.errors) {
      throw new GraphQLError(response);
    }
    return response.data;
  });
};
const InternalsBuildQuery = ({
  ops,
  props,
  returns,
  options,
  scalars
}) => {
  const ibb = (k, o, p = "", root = true, vars = []) => {
    const keyForPath = purifyGraphQLKey(k);
    const newPath = [p, keyForPath].join(SEPARATOR);
    if (!o) {
      return "";
    }
    if (typeof o === "boolean" || typeof o === "number") {
      return k;
    }
    if (typeof o === "string") {
      return `${k} ${o}`;
    }
    if (Array.isArray(o)) {
      const args = InternalArgsBuilt({
        props,
        returns,
        ops,
        scalars,
        vars
      })(o[0], newPath);
      return `${ibb(args ? `${k}(${args})` : k, o[1], p, false, vars)}`;
    }
    if (k === "__alias") {
      return Object.entries(o).map(([alias, objectUnderAlias]) => {
        if (typeof objectUnderAlias !== "object" || Array.isArray(objectUnderAlias)) {
          throw new Error(
            "Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}"
          );
        }
        const operationName = Object.keys(objectUnderAlias)[0];
        const operation = objectUnderAlias[operationName];
        return ibb(`${alias}:${operationName}`, operation, p, false, vars);
      }).join("\n");
    }
    const hasOperationName = root && (options == null ? void 0 : options.operationName) ? " " + options.operationName : "";
    const keyForDirectives = o.__directives ?? "";
    const query2 = `{${Object.entries(o).filter(([k2]) => k2 !== "__directives").map((e) => ibb(...e, [p, `field<>${keyForPath}`].join(SEPARATOR), false, vars)).join("\n")}}`;
    if (!root) {
      return `${k} ${keyForDirectives}${hasOperationName} ${query2}`;
    }
    const varsString = vars.map((v) => `${v.name}: ${v.graphQLType}`).join(", ");
    return `${k} ${keyForDirectives}${hasOperationName}${varsString ? `(${varsString})` : ""} ${query2}`;
  };
  return ibb;
};
const Thunder = (fn, thunderGraphQLOptions) => (operation, graphqlOptions) => (o, ops) => {
  const options = {
    ...thunderGraphQLOptions,
    ...graphqlOptions
  };
  return fn(
    Zeus(operation, o, {
      operationOptions: ops,
      scalars: options == null ? void 0 : options.scalars
    }),
    ops == null ? void 0 : ops.variables
  ).then((data) => {
    if (options == null ? void 0 : options.scalars) {
      return decodeScalarsInResponse({
        response: data,
        initialOp: operation,
        initialZeusQuery: o,
        returns: ReturnTypes,
        scalars: options.scalars,
        ops: Ops
      });
    }
    return data;
  });
};
const Chain = (...options) => Thunder(apiFetch(options));
const SubscriptionThunderSSE = (fn, thunderGraphQLOptions) => (operation, graphqlOptions) => (o, ops) => {
  const options = {
    ...thunderGraphQLOptions,
    ...graphqlOptions
  };
  const returnedFunction = fn(
    Zeus(operation, o, {
      operationOptions: ops,
      scalars: options == null ? void 0 : options.scalars
    }),
    ops == null ? void 0 : ops.variables
  );
  if ((returnedFunction == null ? void 0 : returnedFunction.on) && (options == null ? void 0 : options.scalars)) {
    const wrapped = returnedFunction.on;
    returnedFunction.on = (fnToCall) => wrapped((data) => {
      if (options == null ? void 0 : options.scalars) {
        return fnToCall(
          decodeScalarsInResponse({
            response: data,
            initialOp: operation,
            initialZeusQuery: o,
            returns: ReturnTypes,
            scalars: options.scalars,
            ops: Ops
          })
        );
      }
      return fnToCall(data);
    });
  }
  return returnedFunction;
};
const SubscriptionSSE = (...options) => SubscriptionThunderSSE(apiSubscriptionSSE(options));
const Zeus = (operation, o, ops) => InternalsBuildQuery({
  props: AllTypesProps,
  returns: ReturnTypes,
  ops: Ops,
  options: ops == null ? void 0 : ops.operationOptions,
  scalars: ops == null ? void 0 : ops.scalars
})(operation, o);
const decodeScalarsInResponse = ({
  response,
  scalars,
  returns,
  ops,
  initialZeusQuery,
  initialOp
}) => {
  if (!scalars) {
    return response;
  }
  const builder = PrepareScalarPaths({
    ops,
    returns
  });
  const scalarPaths = builder(initialOp, ops[initialOp], initialZeusQuery);
  if (scalarPaths) {
    const r = traverseResponse({ scalarPaths, resolvers: scalars })(initialOp, response, [ops[initialOp]]);
    return r;
  }
  return response;
};
const traverseResponse = ({
  resolvers,
  scalarPaths
}) => {
  const ibb = (k, o, p = []) => {
    var _a;
    if (Array.isArray(o)) {
      return o.map((eachO) => ibb(k, eachO, p));
    }
    if (o == null) {
      return o;
    }
    const scalarPathString = p.join(SEPARATOR);
    const currentScalarString = scalarPaths[scalarPathString];
    if (currentScalarString) {
      const currentDecoder = (_a = resolvers[currentScalarString.split(".")[1]]) == null ? void 0 : _a.decode;
      if (currentDecoder) {
        return currentDecoder(o);
      }
    }
    if (typeof o === "boolean" || typeof o === "number" || typeof o === "string" || !o) {
      return o;
    }
    const entries = Object.entries(o).map(([k2, v]) => [k2, ibb(k2, v, [...p, purifyGraphQLKey(k2)])]);
    const objectFromEntries = entries.reduce((a, [k2, v]) => {
      a[k2] = v;
      return a;
    }, {});
    return objectFromEntries;
  };
  return ibb;
};
const SEPARATOR = "|";
class GraphQLError extends Error {
  constructor(response) {
    super("");
    this.response = response;
    console.error(response);
  }
  toString() {
    return "GraphQL Response Error";
  }
}
const ExtractScalar = (mappedParts, returns) => {
  if (mappedParts.length === 0) {
    return;
  }
  const oKey = mappedParts[0];
  const returnP1 = returns[oKey];
  if (typeof returnP1 === "object") {
    const returnP2 = returnP1[mappedParts[1]];
    if (returnP2) {
      return ExtractScalar([returnP2, ...mappedParts.slice(2)], returns);
    }
    return void 0;
  }
  return returnP1;
};
const PrepareScalarPaths = ({ ops, returns }) => {
  const ibb = (k, originalKey, o, p = [], pOriginals = [], root = true) => {
    if (!o) {
      return;
    }
    if (typeof o === "boolean" || typeof o === "number" || typeof o === "string") {
      const extractionArray = [...pOriginals, originalKey];
      const isScalar = ExtractScalar(extractionArray, returns);
      if (isScalar == null ? void 0 : isScalar.startsWith("scalar")) {
        const partOfTree = {
          [[...p, k].join(SEPARATOR)]: isScalar
        };
        return partOfTree;
      }
      return {};
    }
    if (Array.isArray(o)) {
      return ibb(k, k, o[1], p, pOriginals, false);
    }
    if (k === "__alias") {
      return Object.entries(o).map(([alias, objectUnderAlias]) => {
        if (typeof objectUnderAlias !== "object" || Array.isArray(objectUnderAlias)) {
          throw new Error(
            "Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}"
          );
        }
        const operationName = Object.keys(objectUnderAlias)[0];
        const operation = objectUnderAlias[operationName];
        return ibb(alias, operationName, operation, p, pOriginals, false);
      }).reduce((a, b) => ({
        ...a,
        ...b
      }));
    }
    const keyName = root ? ops[k] : k;
    return Object.entries(o).filter(([k2]) => k2 !== "__directives").map(([k2, v]) => {
      const isInlineFragment = originalKey.match(/^...\s*on/) != null;
      return ibb(
        k2,
        k2,
        v,
        isInlineFragment ? p : [...p, purifyGraphQLKey(keyName || k2)],
        isInlineFragment ? pOriginals : [...pOriginals, purifyGraphQLKey(originalKey)],
        false
      );
    }).reduce((a, b) => ({
      ...a,
      ...b
    }));
  };
  return ibb;
};
const purifyGraphQLKey = (k) => k.replace(/\([^)]*\)/g, "").replace(/^[^:]*\:/g, "");
const mapPart = (p) => {
  const [isArg, isField] = p.split("<>");
  if (isField) {
    return {
      v: isField,
      __type: "field"
    };
  }
  return {
    v: isArg,
    __type: "arg"
  };
};
const ResolveFromPath = (props, returns, ops) => {
  const ResolvePropsType = (mappedParts) => {
    const oKey = ops[mappedParts[0].v];
    const propsP1 = oKey ? props[oKey] : props[mappedParts[0].v];
    if (propsP1 === "enum" && mappedParts.length === 1) {
      return "enum";
    }
    if (typeof propsP1 === "string" && propsP1.startsWith("scalar.") && mappedParts.length === 1) {
      return propsP1;
    }
    if (typeof propsP1 === "object") {
      if (mappedParts.length < 2) {
        return "not";
      }
      const propsP2 = propsP1[mappedParts[1].v];
      if (typeof propsP2 === "string") {
        return rpp(
          `${propsP2}${SEPARATOR}${mappedParts.slice(2).map((mp) => mp.v).join(SEPARATOR)}`
        );
      }
      if (typeof propsP2 === "object") {
        if (mappedParts.length < 3) {
          return "not";
        }
        const propsP3 = propsP2[mappedParts[2].v];
        if (propsP3 && mappedParts[2].__type === "arg") {
          return rpp(
            `${propsP3}${SEPARATOR}${mappedParts.slice(3).map((mp) => mp.v).join(SEPARATOR)}`
          );
        }
      }
    }
  };
  const ResolveReturnType = (mappedParts) => {
    if (mappedParts.length === 0) {
      return "not";
    }
    const oKey = ops[mappedParts[0].v];
    const returnP1 = oKey ? returns[oKey] : returns[mappedParts[0].v];
    if (typeof returnP1 === "object") {
      if (mappedParts.length < 2) return "not";
      const returnP2 = returnP1[mappedParts[1].v];
      if (returnP2) {
        return rpp(
          `${returnP2}${SEPARATOR}${mappedParts.slice(2).map((mp) => mp.v).join(SEPARATOR)}`
        );
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
    return "not";
  };
  return rpp;
};
const InternalArgsBuilt = ({
  props,
  ops,
  returns,
  scalars,
  vars
}) => {
  const arb = (a, p = "", root = true) => {
    var _a, _b;
    if (typeof a === "string") {
      if (a.startsWith(START_VAR_NAME)) {
        const [varName, graphQLType] = a.replace(START_VAR_NAME, "$").split(GRAPHQL_TYPE_SEPARATOR);
        const v = vars.find((v2) => v2.name === varName);
        if (!v) {
          vars.push({
            name: varName,
            graphQLType
          });
        } else {
          if (v.graphQLType !== graphQLType) {
            throw new Error(
              `Invalid variable exists with two different GraphQL Types, "${v.graphQLType}" and ${graphQLType}`
            );
          }
        }
        return varName;
      }
    }
    const checkType = ResolveFromPath(props, returns, ops)(p);
    if (checkType.startsWith("scalar.")) {
      const [_, ...splittedScalar] = checkType.split(".");
      const scalarKey = splittedScalar.join(".");
      return ((_b = (_a = scalars == null ? void 0 : scalars[scalarKey]) == null ? void 0 : _a.encode) == null ? void 0 : _b.call(_a, a)) || JSON.stringify(a);
    }
    if (Array.isArray(a)) {
      return `[${a.map((arr) => arb(arr, p, false)).join(", ")}]`;
    }
    if (typeof a === "string") {
      if (checkType === "enum") {
        return a;
      }
      return `${JSON.stringify(a)}`;
    }
    if (typeof a === "object") {
      if (a === null) {
        return `null`;
      }
      const returnedObjectString = Object.entries(a).filter(([, v]) => typeof v !== "undefined").map(([k, v]) => `${k}: ${arb(v, [p, k].join(SEPARATOR), false)}`).join(",\n");
      if (!root) {
        return `{${returnedObjectString}}`;
      }
      return returnedObjectString;
    }
    return `${a}`;
  };
  return arb;
};
const START_VAR_NAME = `$ZEUS_VAR`;
const GRAPHQL_TYPE_SEPARATOR = `__$GRAPHQL__`;
const createChain = () => {
  const token = useAuthStore.getState().token;
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["token"] = token;
  }
  return Chain("/graphql", { headers });
};
const query = () => createChain()("query");
const mutation = () => createChain()("mutation");
const subscription = () => {
  const token = useAuthStore.getState().token;
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["token"] = token;
  }
  const host = typeof window !== "undefined" ? window.location.origin : "http://localhost:4102";
  const sseUrl = `${host}/graphql`;
  return SubscriptionSSE(sseUrl, { headers })("subscription");
};
function useAuth() {
  const { token, user, isLoading, error, setToken, setUser, setLoading, setError, logout } = useAuthStore();
  const fetchUser = useCallback(async () => {
    var _a;
    if (!token) return null;
    setLoading(true);
    setError(null);
    try {
      const data = await query()({
        user: {
          me: { _id: true, username: true }
        }
      });
      if ((_a = data.user) == null ? void 0 : _a.me) {
        setUser(data.user.me);
        return data.user.me;
      }
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch user";
      setError(message);
      if (message.includes("Unauthorized")) {
        logout();
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setError, setUser, logout]);
  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mutation()({
        login: [{ username, password }, true]
      });
      setToken(data.login);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const register = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mutation()({
        register: [{ username, password }, true]
      });
      setToken(data.register);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const authenticate = async (mode, username, password) => {
    if (mode === "register") {
      return register(username, password);
    }
    return login(username, password);
  };
  const clearError = () => setError(null);
  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated: !!token,
    authenticate,
    logout,
    clearError
  };
}
function Landing() {
  const { isAuthenticated, authenticate, isLoading, error } = useAuth();
  if (isAuthenticated) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/app", replace: true });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-white mb-2", children: "Axolotl Starter" }),
      /* @__PURE__ */ jsx("p", { className: "text-white/60", children: "GraphQL Yoga + Zeus + Vite" })
    ] }),
    /* @__PURE__ */ jsx(AuthForm, { onSubmit: authenticate, isLoading, error }),
    /* @__PURE__ */ jsx("p", { className: "text-white/40 text-xs text-center mt-6", children: "Powered by Axolotl + GraphQL Yoga + Zeus" })
  ] }) });
}
function useTodos() {
  const token = useAuthStore((state) => state.token);
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchTodos = useCallback(async () => {
    var _a;
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await query()({
        user: {
          todos: { _id: true, content: true, done: true }
        }
      });
      if ((_a = data.user) == null ? void 0 : _a.todos) {
        setTodos(data.user.todos);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch todos");
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  const createTodo = async (content) => {
    if (!token || !content.trim()) return false;
    setIsLoading(true);
    setError(null);
    try {
      await mutation()({
        user: {
          createTodo: [{ content }, true]
        }
      });
      await fetchTodos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const markDone = async (todoId) => {
    if (!token) return false;
    setIsLoading(true);
    setError(null);
    try {
      await mutation()({
        user: {
          todoOps: [{ _id: todoId }, { markDone: true }]
        }
      });
      await fetchTodos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark todo as done");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const clearTodos = () => setTodos([]);
  const clearError = () => setError(null);
  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    markDone,
    clearTodos,
    clearError
  };
}
function useTodoSubscription({ ownerId, onTodoCreated, onTodoUpdated }) {
  const subscriptionRef = useRef(null);
  const onTodoCreatedRef = useRef(onTodoCreated);
  const onTodoUpdatedRef = useRef(onTodoUpdated);
  useEffect(() => {
    onTodoCreatedRef.current = onTodoCreated;
    onTodoUpdatedRef.current = onTodoUpdated;
  }, [onTodoCreated, onTodoUpdated]);
  useEffect(() => {
    if (!ownerId) {
      console.log("[useTodoSubscription] No ownerId, skipping subscription");
      return;
    }
    console.log("[useTodoSubscription] Starting subscription for ownerId:", ownerId);
    try {
      const sub = subscription()({
        todoUpdates: [
          { ownerId },
          {
            type: true,
            todo: {
              _id: true,
              content: true,
              done: true
            }
          }
        ]
      });
      sub.on((data) => {
        var _a, _b;
        console.log("[useTodoSubscription] Received data:", data);
        const { type, todo } = data.todoUpdates;
        if (type === "CREATED") {
          toast.success(`New todo: "${todo.content}"`);
          (_a = onTodoCreatedRef.current) == null ? void 0 : _a.call(onTodoCreatedRef, todo);
        } else if (type === "UPDATED") {
          toast.info(`Todo completed: "${todo.content}"`);
          (_b = onTodoUpdatedRef.current) == null ? void 0 : _b.call(onTodoUpdatedRef, todo);
        }
      });
      sub.error((err) => {
        console.error("[useTodoSubscription] Subscription error:", err);
      });
      sub.off(() => {
        console.log("[useTodoSubscription] Subscription closed");
      });
      console.log("[useTodoSubscription] Subscription started successfully");
      subscriptionRef.current = sub;
    } catch (err) {
      console.error("[useTodoSubscription] Failed to start subscription:", err);
    }
    return () => {
      console.log("[useTodoSubscription] Cleaning up subscription");
      if (subscriptionRef.current) {
        subscriptionRef.current.close();
        subscriptionRef.current = null;
      }
    };
  }, [ownerId]);
  return {
    isSubscribed: !!subscriptionRef.current
  };
}
function Dashboard() {
  const { user, isLoading: authLoading, error: authError, isAuthenticated, logout } = useAuth();
  const {
    todos,
    isLoading: todosLoading,
    error: todosError,
    fetchTodos,
    createTodo,
    markDone,
    clearTodos
  } = useTodos();
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
      toast.info("Dashboard loaded - subscription active");
    } else {
      clearTodos();
    }
  }, [isAuthenticated]);
  useTodoSubscription({
    ownerId: (user == null ? void 0 : user._id) ?? null,
    onTodoCreated: () => fetchTodos(),
    onTodoUpdated: () => fetchTodos()
  });
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true });
  }
  const isLoading = authLoading || todosLoading;
  const error = authError || todosError;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsx(Header, { user, onLogout: logout }),
      /* @__PURE__ */ jsx(ErrorMessage, { message: error }),
      /* @__PURE__ */ jsx(TodoForm, { onSubmit: createTodo, isLoading }),
      /* @__PURE__ */ jsx(TodoList, { todos, onMarkDone: markDone, isLoading }),
      /* @__PURE__ */ jsx("p", { className: "text-white/40 text-xs text-center mt-6", children: "Powered by Axolotl + GraphQL Yoga + Zeus" })
    ] }),
    /* @__PURE__ */ jsx(ToastContainer, {})
  ] });
}
const navItems = [
  { path: "/admin", label: "Dashboard", icon: "📊" },
  { path: "/admin/users", label: "Users", icon: "👥" },
  { path: "/admin/settings", label: "Settings", icon: "⚙️" }
];
function AdminLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-900 flex", children: [
    /* @__PURE__ */ jsxs("aside", { className: "w-64 bg-slate-800 border-r border-slate-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-slate-700", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-white", children: "Admin Panel" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-400", children: [
          "Logged in as ",
          user == null ? void 0 : user.username
        ] })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "p-4", children: /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.path,
            className: `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsx("span", { children: item.icon }),
              /* @__PURE__ */ jsx("span", { children: item.label })
            ]
          }
        ) }, item.path);
      }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-4 right-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: logout,
            className: "w-full px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-left",
            children: "Logout"
          }
        ),
        /* @__PURE__ */ jsx(Link, { to: "/app", className: "block w-full px-4 py-2 text-slate-400 hover:text-white text-sm mt-2", children: "← Back to App" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "flex-1 p-8", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
function AdminDashboard() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-6", children: "Dashboard" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-800 rounded-lg p-6 border border-slate-700", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-slate-400 text-sm font-medium mb-2", children: "Total Users" }),
        /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-white", children: "--" }),
        /* @__PURE__ */ jsx("p", { className: "text-emerald-400 text-sm mt-2", children: "Connect to fetch" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-800 rounded-lg p-6 border border-slate-700", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-slate-400 text-sm font-medium mb-2", children: "Total Todos" }),
        /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-white", children: "--" }),
        /* @__PURE__ */ jsx("p", { className: "text-emerald-400 text-sm mt-2", children: "Connect to fetch" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-800 rounded-lg p-6 border border-slate-700", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-slate-400 text-sm font-medium mb-2", children: "Completed" }),
        /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-white", children: "--" }),
        /* @__PURE__ */ jsx("p", { className: "text-emerald-400 text-sm mt-2", children: "Connect to fetch" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-800 rounded-lg p-6 border border-slate-700", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Recent Activity" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-slate-400", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-emerald-400 rounded-full" }),
          /* @__PURE__ */ jsx("span", { children: "Admin dashboard skeleton ready" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-slate-400", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-slate-500 rounded-full" }),
          /* @__PURE__ */ jsx("span", { children: "Add real data fetching here" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-slate-400", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-slate-500 rounded-full" }),
          /* @__PURE__ */ jsx("span", { children: "Implement admin queries in schema" })
        ] })
      ] })
    ] })
  ] });
}
function AdminUsers() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-6", children: "Users" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-800 rounded-lg border border-slate-700", children: [
      /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-slate-700", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search users...",
            className: "bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
          }
        ),
        /* @__PURE__ */ jsx("button", { className: "bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors", children: "Add User" })
      ] }) }),
      /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-slate-400 text-sm", children: [
          /* @__PURE__ */ jsx("th", { className: "p-4", children: "Username" }),
          /* @__PURE__ */ jsx("th", { className: "p-4", children: "Created" }),
          /* @__PURE__ */ jsx("th", { className: "p-4", children: "Todos" }),
          /* @__PURE__ */ jsx("th", { className: "p-4", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: /* @__PURE__ */ jsx("tr", { className: "border-t border-slate-700", children: /* @__PURE__ */ jsx("td", { className: "p-4 text-slate-300", colSpan: 4, children: /* @__PURE__ */ jsx("div", { className: "text-center text-slate-500", children: "Connect to backend to load users" }) }) }) })
      ] })
    ] })
  ] });
}
function AdminSettings() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-6", children: "Settings" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-800 rounded-lg p-6 border border-slate-700", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "General" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm text-slate-400 mb-2", children: "Site Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                defaultValue: "Axolotl Starter",
                className: "w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm text-slate-400 mb-2", children: "Admin Email" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                placeholder: "admin@example.com",
                className: "w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-800 rounded-lg p-6 border border-slate-700", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "API Configuration" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm text-slate-400 mb-2", children: "GraphQL Endpoint" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                defaultValue: "/graphql",
                disabled: true,
                className: "w-full bg-slate-700/50 text-slate-400 px-4 py-2 rounded-lg border border-slate-600"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", id: "enableIntrospection", className: "rounded" }),
            /* @__PURE__ */ jsx("label", { htmlFor: "enableIntrospection", className: "text-slate-300", children: "Enable GraphQL Introspection" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx("button", { className: "bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors", children: "Save Changes" }) })
    ] })
  ] });
}
function AppRoutes() {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Landing, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/app", element: /* @__PURE__ */ jsx(Dashboard, {}) }),
    /* @__PURE__ */ jsxs(Route, { path: "/admin", element: /* @__PURE__ */ jsx(AdminLayout, {}), children: [
      /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(AdminDashboard, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "users", element: /* @__PURE__ */ jsx(AdminUsers, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "settings", element: /* @__PURE__ */ jsx(AdminSettings, {}) })
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(AppRoutes, {});
}
function render(url) {
  const html = renderToString(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, {}) }) })
  );
  return { html };
}
export {
  render
};
