declare const _default: {
    Mutation: {
        register: (_: [any, any, import("graphql-yoga").YogaInitialContext], { password, username }: {
            username: string;
            password: string;
        }) => Promise<string | null>;
    };
};
export default _default;
