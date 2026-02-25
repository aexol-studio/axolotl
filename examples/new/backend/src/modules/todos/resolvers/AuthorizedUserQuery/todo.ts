import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  AuthorizedUserQuery: {
    todo: async ([, , context], { _id }) => {
      const todo = await prisma.todo.findFirst({
        where: { id: _id, ownerId: context.authUser!._id },
      });
      if (!todo) return undefined;
      return { _id: todo.id, content: todo.content, done: todo.done };
    },
  },
});
