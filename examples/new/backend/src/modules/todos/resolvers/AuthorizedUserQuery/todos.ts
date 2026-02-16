import { createResolvers } from '../../axolotl.js';
import { User } from '../../../users/models.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  AuthorizedUserQuery: {
    todos: async ([source]) => {
      const src = source as User;
      const todos = await prisma.todo.findMany({
        where: { ownerId: src._id },
      });
      return todos.map((t: { id: string; content: string; done: boolean }) => ({
        _id: t.id,
        content: t.content,
        done: t.done,
      }));
    },
  },
});
