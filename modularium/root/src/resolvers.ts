import { mergeAxolotls } from '@aexol/axolotl-core';
import userResolvers from '@/src/modules/users/resolvers.js';

const usersModule = userResolvers({
  sendMailRegister: async (args) =>
    console.log(
      `We don't send mails from modularium:\n\tusername:${args.username}\n\ttoken:${args.authorizationToken}`,
    ),
  sendMailForgotPassword: async (args) =>
    console.log(
      `We don't send mails from modularium:\n\tusername:${args.username}\n\ttoken:${args.resetPasswordToken}`,
    ),
});

export default mergeAxolotls(usersModule);
