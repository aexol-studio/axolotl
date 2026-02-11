import { createResolvers } from '../../axolotl.js';
import { Todo } from '../../models.js';
import { prisma } from '@/src/db.js';
import { todoPubSub } from '../../pubsub.js';

export default createResolvers({
  TodoOps: {
    markDone: async ([source]) => {
      const src = source as Todo;
      const todo = await prisma.todo.findUnique({
        where: { id: src._id },
      });
      if (!todo || todo.done) return false;
      const updatedTodo = await prisma.todo.update({
        where: { id: src._id },
        data: { done: true },
      });

      // Publish the updated todo to subscribers
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
