declare const _default: {
    Subscription: {
        todoUpdates: import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                ownerId: string;
            };
        }, {
            type: import("../pubsub.js").TodoUpdateType;
            todo: import("../models.js").Todo<{
                ID: any;
                Secret: any;
            }>;
        }>;
    };
    Mutation: {
        user: (input: [any, any, import("graphql-yoga").YogaInitialContext]) => Promise<{
            _id: string;
            username: string;
        }>;
    };
    Query: {
        user: (input: [any, any, import("graphql-yoga").YogaInitialContext]) => Promise<{
            _id: string;
            username: string;
        }>;
    };
    AuthorizedUserQuery: {
        todo: ([source]: [any, any, import("graphql-yoga").YogaInitialContext], { _id }: {
            _id: string;
        }) => Promise<{
            _id: string;
            content: string;
            done: boolean;
        } | undefined>;
        todos: ([source]: [any, any, import("graphql-yoga").YogaInitialContext]) => Promise<{
            _id: string;
            content: string;
            done: boolean;
        }[]>;
    };
    AuthorizedUserMutation: {
        todoOps: ([source]: [any, any, import("graphql-yoga").YogaInitialContext], { _id }: {
            _id: string;
        }) => Promise<{
            _id: string;
            content: string;
            done: boolean;
        } | undefined>;
        createTodo: ([source]: [any, any, import("graphql-yoga").YogaInitialContext], { content }: {
            content: string;
            secret?: number | null | undefined;
        }) => Promise<string>;
    };
    TodoOps: {
        markDone: ([source]: [any, any, import("graphql-yoga").YogaInitialContext]) => Promise<boolean>;
    };
};
export default _default;
