import { mergeAxolotls } from '@aexol/axolotl-core';
import todosResolvers from "./todos/resolvers/resolvers.js";
import usersResolvers from "./users/resolvers/resolvers.js";
export default mergeAxolotls(todosResolvers, usersResolvers);
//# sourceMappingURL=resolvers.js.map