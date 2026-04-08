import { createResolvers } from '../../axolotl.js';
import { prisma } from "../../../db.js";
export default createResolvers({
    AuthorizedUserQuery: {
        todos: async ([source]) => {
            const src = source;
            const todos = await prisma.todo.findMany({
                where: { ownerId: src._id },
            });
            return todos.map((t) => ({
                _id: t.id,
                content: t.content,
                done: t.done,
            }));
        },
    },
});
//# sourceMappingURL=todos.js.map