declare const _default: {
    AuthorizedUserMutation: {
        changePassword: ([source]: [any, any, import("graphql-yoga").YogaInitialContext], { newPassword }: {
            newPassword: string;
        }) => Promise<{
            _id: string;
            username: string;
        }>;
    };
};
export default _default;
