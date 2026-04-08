declare const _default: {
    Subscription: {
        todoUpdates: import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                ownerId: string;
            };
        }, {
            type: import("../../pubsub.js").TodoUpdateType;
            todo: import("../../models.js").Todo<{
                ID: any;
                Secret: any;
            }>;
        }>;
    };
};
export default _default;
