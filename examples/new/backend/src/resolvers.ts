import { mergeAxolotls } from '@aexol/axolotl-core';
import authResolvers from '@/src/modules/auth/resolvers/resolvers.js';
import todosResolvers from '@/src/modules/todos/resolvers/resolvers.js';
import usersResolvers from '@/src/modules/users/resolvers/resolvers.js';
import notesResolvers from '@/src/modules/notes/resolvers/resolvers.js';

export default mergeAxolotls(authResolvers, todosResolvers, usersResolvers, notesResolvers);
