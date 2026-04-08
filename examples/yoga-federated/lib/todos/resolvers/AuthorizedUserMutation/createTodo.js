import { createResolvers } from '../../axolotl.js';
import { prisma } from "../../../db.js";
import { todoPubSub } from '../../pubsub.js';
export default createResolvers({
    AuthorizedUserMutation: {
        createTodo: async ([source], { content }) => {
            const src = source;
            const todo = await prisma.todo.create({
                data: {
                    content,
                    ownerId: src._id,
                },
            });
            todoPubSub.publish({
                type: 'CREATED',
                todo: {
                    _id: todo.id,
                    content: todo.content,
                    done: todo.done,
                },
                ownerId: src._id,
            });
            return todo.id;
        },
    },
});
//# sourceMappingURL=createTodo.js.map