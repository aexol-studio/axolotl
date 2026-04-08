import { createResolvers } from '../../axolotl.js';
import { prisma } from "../../../db.js";
import { todoPubSub } from '../../pubsub.js';
export default createResolvers({
    TodoOps: {
        markDone: async ([source]) => {
            const src = source;
            const todo = await prisma.todo.findUnique({
                where: { id: src._id },
            });
            if (!todo || todo.done)
                return false;
            const updatedTodo = await prisma.todo.update({
                where: { id: src._id },
                data: { done: true },
            });
            todoPubSub.publish({
                type: 'UPDATED',
                todo: {
                    _id: updatedTodo.id,
                    content: updatedTodo.content,
                    done: updatedTodo.done,
                },
                ownerId: updatedTodo.ownerId,
            });
            return true;
        },
    },
});
//# sourceMappingURL=markDone.js.map