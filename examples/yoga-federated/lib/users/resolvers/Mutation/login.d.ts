declare const _default: {
    Mutation: {
        login: (_: [any, any, import("graphql-yoga").YogaInitialContext], { password, username }: {
            username: string;
            password: string;
        }) => Promise<string | null | undefined>;
    };
};
export default _default;
