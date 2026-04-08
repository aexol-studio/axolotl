declare const _default: {
    AuthorizedUserMutation: {
        createTodo: ([source]: [any, any, import("graphql-yoga").YogaInitialContext], { content }: {
            content: string;
            secret?: number | null | undefined;
        }) => Promise<string>;
    };
};
export default _default;
