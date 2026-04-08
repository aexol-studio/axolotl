declare const _default: {
    AuthorizedUserQuery: {
        todos: ([source]: [any, any, import("graphql-yoga").YogaInitialContext]) => Promise<{
            _id: string;
            content: string;
            done: boolean;
        }[]>;
    };
};
export default _default;
