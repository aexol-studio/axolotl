import { createResolvers } from '../../axolotl.js';
import user from './user.js';
import login from './login.js';
import register from './register.js';

export default createResolvers({
  Mutation: {
    ...user.Mutation,
    ...login.Mutation,
    ...register.Mutation,
  },
});
