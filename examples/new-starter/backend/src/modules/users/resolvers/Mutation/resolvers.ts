import { createResolvers } from '../../axolotl.js';
import login from './login.js';
import register from './register.js';

export default createResolvers({
  Mutation: {
    ...login.Mutation,
    ...register.Mutation,
  },
});
