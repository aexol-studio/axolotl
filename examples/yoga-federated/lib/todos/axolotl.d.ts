import { Models } from "./models.js";
export declare const applyMiddleware: <Z extends {
    Todo?: {
        _id?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
        content?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
        done?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
    } | undefined;
    User?: {
        _id?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
    } | undefined;
    TodoOps?: {
        markDone?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
    } | undefined;
    AuthorizedUserMutation?: {
        createTodo?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                content: string;
                secret?: number | null | undefined;
            };
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                content: string;
                secret?: number | null | undefined;
            };
        }, any> | undefined;
        todoOps?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                _id: string;
            };
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                _id: string;
            };
        }, any> | undefined;
    } | undefined;
    AuthorizedUserQuery?: {
        todos?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
        todo?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                _id: string;
            };
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                _id: string;
            };
        }, any> | undefined;
    } | undefined;
    Query?: {
        user?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
    } | undefined;
    TodoUpdate?: {
        type?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
        todo?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
    } | undefined;
    Subscription?: {
        todoUpdates?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                ownerId: string;
            };
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                ownerId: string;
            };
        }, any> | undefined;
    } | undefined;
    Mutation?: {
        user?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
    } | undefined;
}>(r: Z & { [P_1 in keyof Z]: P_1 extends keyof Models<{
    Secret: number;
    ID: string;
}> ? Z[P_1] : never; }, middlewares: import("@aexol/axolotl-core").CustomMiddlewareHandler<[any, any, import("graphql-yoga").YogaInitialContext]>[], k: { [P_1_1 in keyof Z]?: { [Y in keyof Z[P_1_1]]?: true | undefined; } | undefined; }) => void, createResolvers: <Z extends {
    Todo?: {
        _id?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
        content?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
        done?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
    } | undefined;
    User?: {
        _id?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
    } | undefined;
    TodoOps?: {
        markDone?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
    } | undefined;
    AuthorizedUserMutation?: {
        createTodo?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                content: string;
                secret?: number | null | undefined;
            };
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                content: string;
                secret?: number | null | undefined;
            };
        }, any> | undefined;
        todoOps?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                _id: string;
            };
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                _id: string;
            };
        }, any> | undefined;
    } | undefined;
    AuthorizedUserQuery?: {
        todos?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
        todo?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                _id: string;
            };
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                _id: string;
            };
        }, any> | undefined;
    } | undefined;
    Query?: {
        user?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
    } | undefined;
    TodoUpdate?: {
        type?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
        todo?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
    } | undefined;
    Subscription?: {
        todoUpdates?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                ownerId: string;
            };
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                ownerId: string;
            };
        }, any> | undefined;
    } | undefined;
    Mutation?: {
        user?: import("@aexol/axolotl-core").CustomHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, unknown> | import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: Record<string, never>;
        }, any> | undefined;
    } | undefined;
}>(k: Z & { [P_1 in keyof Z]: P_1 extends keyof Models<{
    Secret: number;
    ID: string;
}> ? Z[P_1] : never; }) => Z, createDirectives: <Z extends {}>(k: Z & { [P_1 in keyof Z]: import("@aexol/axolotl-graphql-yoga").SchemaMapper; }) => Z, adapter: (objects: import("@aexol/axolotl-core").ObjectsUnknown<[any, any, import("graphql-yoga").YogaInitialContext], import("@aexol/axolotl-graphql-yoga").SchemaMapper>, options?: {
    yoga?: Parameters<typeof import("graphql-yoga").createYoga>[0];
    schema?: {
        options?: Parameters<typeof import("graphql-yoga").createYoga>[0]["schema"];
        file?: {
            path: string;
        } | {
            content: string;
        };
    };
    context?: (initial: import("graphql-yoga").YogaInitialContext) => Promise<Record<string, any>> | Record<string, any>;
} | undefined) => {
    server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    yoga: import("graphql-yoga").YogaServerInstance<import("graphql-yoga").YogaInitialContext, {}>;
};
