import { VerifyEmailError } from '@/src/modules/users/models.js';
import { MongoOrb } from '@/src/modules/users/orm.js';

export const verifyEmail = async (args: { verifyData: { token: string } }) => {
  const userToAuthorize = await MongoOrb('UserAuthorizationCollection').collection.findOne({
    authorizationToken: args.verifyData.token,
  });
  if (!userToAuthorize) {
    return { hasError: VerifyEmailError.TOKEN_CANNOT_BE_FOUND };
  }
  await Promise.all([
    MongoOrb('UserAuthorizationCollection').collection.updateOne(
      { userId: userToAuthorize.userId },
      { $unset: { authorizationToken: '' } },
    ),
    MongoOrb('UserCollection').collection.updateOne(
      { _id: userToAuthorize.userId },
      { $set: { emailConfirmed: true } },
    ),
  ]);
  return true;
};
