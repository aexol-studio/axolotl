declare const _default: {
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
