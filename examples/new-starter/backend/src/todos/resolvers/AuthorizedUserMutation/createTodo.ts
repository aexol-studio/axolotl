import { createResolvers } from '../../axolotl.js';
import { User } from '../../models.js';
import { prisma } from '@/src/db.js';
import { todoPubSub } from '../../pubsub.js';

export default createResolvers({
  AuthorizedUserMutation: {
    createTodo: async ([source], { content }) => {
      const src = source as User;
      const todo = await prisma.todo.create({
        data: {
          content,
          ownerId: src._id,
        },
      });

      // Publish the new todo to subscribers
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
