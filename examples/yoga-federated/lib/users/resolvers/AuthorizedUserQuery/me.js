import { createResolvers } from '../../axolotl.js';
export default createResolvers({
    AuthorizedUserQuery: {
        me: ([source]) => {
            const src = source;
            return src;
        },
    },
});
//# sourceMappingURL=me.js.map