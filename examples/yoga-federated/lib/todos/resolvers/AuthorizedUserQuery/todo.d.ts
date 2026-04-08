declare const _default: {
    AuthorizedUserQuery: {
        todo: ([source]: [any, any, import("graphql-yoga").YogaInitialContext], { _id }: {
            _id: string;
        }) => Promise<{
            _id: string;
            content: string;
            done: boolean;
        } | undefined>;
    };
};
export default _default;
