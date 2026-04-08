declare const _default: {
    Subscription: {
        aiChat: import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                messages: Array<import("../../models.js").AIChatMessage>;
                system?: string | undefined | null;
            };
        }, {
            content: string;
            done: boolean;
        }>;
        countdown: import("@aexol/axolotl-core").InternalSubscriptionHandler<[any, any, import("graphql-yoga").YogaInitialContext], {
            args: {
                from?: number | undefined | null;
            };
        }, number>;
    };
};
export default _default;
