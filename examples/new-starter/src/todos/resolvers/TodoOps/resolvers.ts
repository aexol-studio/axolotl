import { createResolvers } from '../../axolotl.js';
import markDone from './markDone.js';

export default createResolvers({
  TodoOps: {
    ...markDone.TodoOps,
  },
});
