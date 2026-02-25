import { z } from 'zod';
import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import { todoPubSub } from '../../pubsub.js';
import { parseInput, todoContentSchema } from '@/src/lib/validation.js';

const createTodoSchema = z.object({ content: todoContentSchema });

export default createResolvers({
  AuthorizedUserMutation: {
    createTodo: async ([, , context], { content: rawContent }) => {
      const { content } = parseInput(createTodoSchema, { content: rawContent });
      const userId = context.authUser!._id;
      const todo = await prisma.todo.create({
        data: {
          content,
          ownerId: userId,
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
        ownerId: userId,
      });

      return todo.id;
    },
  },
});
