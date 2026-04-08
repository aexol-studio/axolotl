import { createResolvers } from '../../axolotl.js';
import { prisma } from "../../../db.js";
export default createResolvers({
    AuthorizedUserQuery: {
        todo: async ([source], { _id }) => {
            const src = source;
            const todo = await prisma.todo.findFirst({
                where: { id: _id, ownerId: src._id },
            });
            if (!todo)
                return undefined;
            return { _id: todo.id, content: todo.content, done: todo.done };
        },
    },
});
//# sourceMappingURL=todo.js.map