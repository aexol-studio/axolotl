import { mergeAxolotls } from '@aexol/axolotl-core';
import todosResolvers from '@/src/todos/resolvers/resolvers.js';
import usersResolvers from '@/src/users/resolvers/resolvers.js';

export default mergeAxolotls(todosResolvers, usersResolvers);
