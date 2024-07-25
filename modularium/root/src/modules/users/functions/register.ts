import { RegisterErrors } from '@/src/modules/users/models.js';
import { MongoOrb } from '@/src/modules/users/orm.js';
import { isPasswordEqualToSpecialParams, passwordSha512 } from '@/src/modules/users/utils.js';
import crypto from 'crypto';

export const register = async (args: {
  user: { password: string; username: string; fullName?: string };
  sendMailRegister: (args: { username: string; authorizationToken: string }) => Promise<any>;
}) => {
  const password = args.user.password;
  const username = args.user.username;
  const userAuthCollection = MongoOrb('UserAuthorizationCollection').collection;
  if (password.length <= 6) {
    return {
      hasError: RegisterErrors.PASSWORD_WEAK,
    };
  }
  if (!isPasswordEqualToSpecialParams(password)) {
    return {
      hasError: RegisterErrors.PASSWORD_WEAK,
    };
  }
  const user = await userAuthCollection.findOne({ username });
  if (user) {
    return {
      hasError: RegisterErrors.USERNAME_EXISTS,
    };
  }
  if (username.length <= 5 && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(username))
    return {
      hasError: RegisterErrors.USERNAME_INVALID,
    };
  const s = crypto.randomBytes(8).toString('hex');
  const { salt, passwordHash } = passwordSha512(password, s);
  const authorizationToken = crypto.pseudoRandomBytes(8).toString('hex');

  let fullNameToUse = args.user.fullName;
  if (!args.user.fullName && username.includes('@')) {
    fullNameToUse = username.split('@')[0];
  }

  const insertedUser = await MongoOrb('UserCollection').createWithAutoFields(
    '_id',
    'createdAt',
  )({
    username,
    fullName: fullNameToUse,
    emailConfirmed: false,
  });
  try {
    const res = await MongoOrb('UserAuthorizationCollection').createWithAutoFields(
      '_id',
      'createdAt',
    )({
      username,
      salt,
      passwordHash,
      authorizationToken,
      userId: insertedUser.insertedId.toString(),
    });

    await args.sendMailRegister({ username, authorizationToken });
    return {
      registered: res.insertedId.toString().length !== 0,
    };
  } catch (error) {
    await await MongoOrb('UserCollection').collection.deleteOne({ _id: insertedUser.insertedId });
    await await MongoOrb('UserAuthorizationCollection').collection.deleteOne({ userId: insertedUser.insertedId });
    throw error;
  }
};
