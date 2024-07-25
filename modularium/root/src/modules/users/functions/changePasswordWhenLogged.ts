import { ChangePasswordWhenLoggedError } from '@/src/modules/users/models.js';
import { MongoOrb } from '@/src/modules/users/orm.js';
import { comparePasswords, isPasswordEqualToSpecialParams, passwordSha512 } from '@/src/modules/users/utils.js';
import crypto from 'crypto';

export const changePasswordWhenLogged = async ({
  user: { newPassword, oldPassword, userId },
}: {
  user: { userId: string; oldPassword: string; newPassword: string };
}) => {
  const findAuthUser = await MongoOrb('UserAuthorizationCollection').collection.findOne({ userId });
  if (!findAuthUser)
    return { hasError: ChangePasswordWhenLoggedError.CANNOT_CHANGE_PASSWORD_FOR_USER_REGISTERED_VIA_SOCIAL };
  const passwordMatch = comparePasswords({
    password: oldPassword,
    hash: findAuthUser.passwordHash || '',
    salt: findAuthUser.salt || '',
  });
  if (!passwordMatch) return { hasError: ChangePasswordWhenLoggedError.OLD_PASSWORD_IS_INVALID };
  if (!isPasswordEqualToSpecialParams(newPassword)) return { hasError: ChangePasswordWhenLoggedError.PASSWORD_WEAK };
  const s = crypto.randomBytes(8).toString('hex');
  const { salt, passwordHash } = passwordSha512(newPassword, s);
  await MongoOrb('UserAuthorizationCollection').collection.updateOne({ userId }, { $set: { salt, passwordHash } });
  return { result: true };
};
