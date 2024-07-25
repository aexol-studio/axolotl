import { MongoOrb } from '@/src/modules/users/orm.js';
import crypto from 'node:crypto';

export const requestForgotPassword = async (args: {
  username: string;
  sendMailForgotPassword: (args: { username: string; resetPasswordToken: string }) => Promise<any>;
}) => {
  const userAuthCollection = MongoOrb('UserAuthorizationCollection').collection;
  if (await userAuthCollection.findOne({ username: args.username })) {
    const resetPasswordToken = crypto.pseudoRandomBytes(8).toString('hex');
    await userAuthCollection.updateOne({ username: args.username }, { $set: { resetPasswordToken } });
    await args.sendMailForgotPassword({ username: args.username, resetPasswordToken });
    return true;
  }
  return false;
};
