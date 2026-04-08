import { User } from '../../models.js';
declare const _default: {
    AuthorizedUserQuery: {
        me: ([source]: [any, any, import("graphql-yoga").YogaInitialContext]) => User<{
            ID: any;
        }>;
    };
};
export default _default;
