import { createResolvers } from '../../axolotl.js';
import { prisma } from "../../../db.js";
export default createResolvers({
    AuthorizedUserMutation: {
        changePassword: async ([source], { newPassword }) => {
            const src = source;
            const token = Math.random().toString(16);
            const user = await prisma.user.update({
                where: { id: src._id },
                data: {
                    password: newPassword,
                    token,
                },
            });
            return { _id: user.id, username: user.username };
        },
    },
});
//# sourceMappingURL=changePassword.js.map