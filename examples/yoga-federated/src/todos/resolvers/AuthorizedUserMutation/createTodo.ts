import { createResolvers } from '../../axolotl.js';
import { User } from '../../models.js';
import { prisma } from '@/src/db.js';

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
      return todo.id;
    },
  },
});
