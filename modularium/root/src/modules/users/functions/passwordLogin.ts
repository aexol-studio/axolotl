import { LoginErrors } from '@/src/modules/users/models.js';
import { MongoOrb } from '@/src/modules/users/orm.js';
import { comparePasswords, getJwtAndRefreshToken } from '@/src/modules/users/utils.js';

export const passwordLogin = async (args: { user: { username: string; password: string } }) => {
  const user = await MongoOrb('UserCollection').collection.findOne({ username: args.user.username });
  if (!user) return { hasError: LoginErrors.INVALID_LOGIN_OR_PASSWORD };
  const userAuth = await MongoOrb('UserAuthorizationCollection').collection.findOne({ userId: user._id });
  if (!userAuth) return { hasError: LoginErrors.INVALID_LOGIN_OR_PASSWORD };
  if (!userAuth.salt || !userAuth.passwordHash)
    return { hasError: LoginErrors.YOU_PROVIDED_OTHER_METHOD_OF_LOGIN_ON_THIS_EMAIL };
  const passwordMatch = comparePasswords({
    password: args.user.password,
    hash: userAuth.passwordHash,
    salt: userAuth.salt,
  });
  if (!passwordMatch) return { hasError: LoginErrors.INVALID_LOGIN_OR_PASSWORD };
  const refreshTokenId = (
    await MongoOrb('RefreshTokenCollection').createWithAutoFields('_id')({
      userId: user._id,
    })
  ).insertedId;
  const { jwtToken, refreshToken } = getJwtAndRefreshToken(userAuth.userId, refreshTokenId);
  return {
    accessToken: jwtToken,
    login: jwtToken,
    refreshToken,
  };
};
