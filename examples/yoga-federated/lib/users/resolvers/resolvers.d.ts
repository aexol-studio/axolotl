declare const _default: {
    Subscription: {
        aiChat: import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                messages: Array<import("../models.js").AIChatMessage>;
                system?: string | undefined | null;
            };
        }, {
            content: string;
            done: boolean;
        }>;
        countdown: import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                from?: number | undefined | null;
            };
        }, number>;
    };
    AuthorizedUserQuery: {
        me: ([source]: [any, any, import("graphql-yoga").YogaInitialContext]) => import("../models.js").User<{
            ID: any;
        }>;
    };
    AuthorizedUserMutation: {
        changePassword: ([source]: [any, any, import("graphql-yoga").YogaInitialContext], { newPassword }: {
            newPassword: string;
        }) => Promise<{
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
    Mutation: {
        register: (_: [any, any, import("graphql-yoga").YogaInitialContext], { password, username }: {
            username: string;
            password: string;
        }) => Promise<string | null>;
        login: (_: [any, any, import("graphql-yoga").YogaInitialContext], { password, username }: {
            username: string;
            password: string;
        }) => Promise<string | null | undefined>;
        user: (input: [any, any, import("graphql-yoga").YogaInitialContext]) => Promise<{
            _id: string;
            username: string;
        }>;
    };
};
export default _default;
