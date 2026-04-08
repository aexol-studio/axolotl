declare const _default: {
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
};
export default _default;
