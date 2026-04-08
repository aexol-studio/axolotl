export const AllTypesProps = {
    Secret: `scalar.Secret`,
    AuthorizedUserMutation: {
        createTodo: {
            secret: "Secret"
        },
        todoOps: {},
        changePassword: {}
    },
    AuthorizedUserQuery: {
        todo: {}
    },
    Mutation: {
        login: {},
        register: {}
    },
    Subscription: {
        countdown: {}
    },
    ID: `scalar.ID`
};
export const ReturnTypes = {
    Todo: {
        _id: "String",
        content: "String",
        done: "Boolean"
    },
    TodoOps: {
        markDone: "Boolean"
    },
    Secret: `scalar.Secret`,
    User: {
        _id: "String",
        username: "String"
    },
    AuthorizedUserMutation: {
        createTodo: "String",
        todoOps: "TodoOps",
        changePassword: "Boolean"
    },
    AuthorizedUserQuery: {
        todos: "Todo",
        todo: "Todo",
        me: "User"
    },
    resolver: {},
    Query: {
        user: "AuthorizedUserQuery"
    },
    Mutation: {
        user: "AuthorizedUserMutation",
        login: "String",
        register: "String"
    },
    Subscription: {
        countdown: "Int"
    },
    ID: `scalar.ID`
};
export const Ops = {
    query: "Query",
    mutation: "Mutation",
    subscription: "Subscription"
};
//# sourceMappingURL=const.js.map