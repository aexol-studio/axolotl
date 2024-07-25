import { ChangePasswordWithTokenError } from '@/src/models.js';
import { MongoOrb } from '@/src/modules/users/orm.js';
import { isPasswordEqualToSpecialParams, passwordSha512 } from '@/src/modules/users/utils.js';
import crypto from 'node:crypto';

export const changePasswordWithToken = async (args: {
  token: { username: string; forgotToken: string; newPassword: string };
}) => {
  const findAuthUser = await MongoOrb('UserAuthorizationCollection').collection.findOne({
    username: args.token.username,
  });
  if (!findAuthUser)
    return { hasError: ChangePasswordWithTokenError.CANNOT_CHANGE_PASSWORD_FOR_USER_REGISTERED_VIA_SOCIAL };
  if (findAuthUser.resetPasswordToken !== args.token.forgotToken)
    return { hasError: ChangePasswordWithTokenError.TOKEN_IS_INVALID };
  if (!isPasswordEqualToSpecialParams(args.token.newPassword))
    return { hasError: ChangePasswordWithTokenError.PASSWORD_IS_TOO_WEAK };
  const s = crypto.randomBytes(8).toString('hex');
  const { salt, passwordHash } = passwordSha512(args.token.newPassword, s);
  await MongoOrb('UserAuthorizationCollection').collection.updateOne(
    { username: args.token.username },
    { $set: { salt, passwordHash }, $unset: { resetPasswordToken: '' } },
  );
  return { result: true };
};
