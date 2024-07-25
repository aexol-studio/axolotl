import { IntegrateSocialAccountError } from '@/src/modules/users/models.js';
import { MongoOrb, UserModel } from '@/src/modules/users/orm.js';
import { comparePasswords } from '@/src/modules/users/utils.js';

export const integrateSocialAccount = async ({
  currentUser,
  socialUser,
}: {
  currentUser: UserModel;
  socialUser: { username: string; password: string };
}) => {
  const userInAuth = await MongoOrb('UserAuthorizationCollection').collection.findOne({
    username: socialUser.username,
  });
  if (!userInAuth) return { hasError: IntegrateSocialAccountError.YOU_HAVE_ONLY_ONE_ACCOUNT };
  if (!userInAuth.passwordHash || !userInAuth.salt)
    return { hasError: IntegrateSocialAccountError.YOUR_ACCOUNT_DOES_NOT_HANDLE_CHANGE_PASSWORD_MODE };
  if (
    comparePasswords({
      password: socialUser.password,
      hash: userInAuth.passwordHash,
      salt: userInAuth.salt,
    })
  ) {
    return { hasError: IntegrateSocialAccountError.INCORRECT_PASSWORD };
  }
  const referUser = await MongoOrb('UserCollection').collection.findOne({ _id: userInAuth.userId });
  if (!referUser) return { hasError: IntegrateSocialAccountError.CANNOT_FIND_USER };
  if (referUser.emailConfirmed === false)
    return { hasError: IntegrateSocialAccountError.YOUR_ACCOUNT_DOES_NOT_HAVE_CONFIRMED_EMAIL };
  await Promise.all([
    MongoOrb('UserCollection').collection.deleteOne({ _id: currentUser._id }),
    MongoOrb('SocialCollection').collection.updateOne({ userId: currentUser._id }, { $set: { userId: referUser._id } }),
  ]);
  return { result: true };
};
