import pkg from 'jsonwebtoken';
import crypto from 'crypto';
import { MongoOrb, UserModel } from '@/src/modules/users/orm.js';
import { SocialKind } from '@/src/modules/users/models.js';
const { verify, sign } = pkg;

export const getEnv = (envName: string) => {
  const v = process.env[envName];
  if (!v) {
    throw new Error(`Environment variable "${envName}" required but not set`);
  }
  return v as string;
};

export const decodeJWTToken = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set');
  }
  const verifiedToken = verify(token, process.env.JWT_SECRET);
  if (typeof verifiedToken !== 'object') {
    throw new Error('Token is not an object');
  }
  return verifiedToken as Record<string, unknown>;
};
export const decodeRefreshToken = (token: string) => {
  const verifiedToken = decodeJWTToken(token);
  if (!verifiedToken.tokenId || !verifiedToken.sub) {
    throw new Error('Invalid token');
  }
  return verifiedToken as { tokenId: string; sub: string };
};
export const decodeToken = (token: string) => {
  const verifiedToken = decodeJWTToken(token);
  if (!verifiedToken.userId) {
    throw new Error('Invalid token');
  }
  return verifiedToken as { userId: string };
};

export const getUser = async (token: string): Promise<UserModel | undefined> => {
  const { userId } = decodeToken(token);
  const user = await MongoOrb('UserCollection').collection.findOne({
    _id: userId,
  });
  if (!user) {
    return;
  }
  return user;
};
export const getUserFromHandlerInput = async (
  authorizationHeaderValue?: string | null,
): Promise<UserModel | undefined> => {
  if (!authorizationHeaderValue) {
    throw new Error('You are not logged in');
  }
  const findUser = await getUser(authorizationHeaderValue);
  if (!findUser) {
    return;
  }
  return findUser;
};

export const getUserFromHandlerInputOrThrow = async (authorizationHeaderValue?: string | null): Promise<UserModel> => {
  const user = await getUserFromHandlerInput(authorizationHeaderValue);
  if (!user) {
    throw new Error('You are not logged in');
  }
  return user;
};

export const isNotNullObject = (v: unknown): v is Record<string | number | symbol, unknown> =>
  typeof v === 'object' && v !== null;

export const comparePasswords = ({ password, hash, salt }: { password: string; hash: string; salt: string }) => {
  return hash === passwordSha512(password, salt).passwordHash;
};

export const passwordSha512 = (password: string, salt: string) => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const passwordHash = hash.digest('hex');
  return {
    salt,
    passwordHash,
  };
};

export const isPasswordEqualToSpecialParams = (password: string): boolean =>
  /[!@#$%^&*()+=._-]/.test(password) && /[a-z]/.test(password) && /[A-Z]/.test(password) && !/\s/.test(password);

export const getJwtAndRefreshToken = (
  id: string,
  refreshTokenId: string,
): { jwtToken: string; refreshToken: string } => {
  const JWT_SECRET = getEnv('JWT_SECRET');
  const JWT_TOKEN_EXPIRATION_IN_SECONDS = process.env['JWT_TOKEN_EXPIRATION_IN_SECONDS'];
  const expiresIn = JWT_TOKEN_EXPIRATION_IN_SECONDS ? parseInt(JWT_TOKEN_EXPIRATION_IN_SECONDS) : 60 * 60 * 24;

  return {
    jwtToken: sign({ userId: id }, JWT_SECRET, {
      expiresIn,
    }),
    refreshToken: sign({ tokenId: refreshTokenId, sub: id }, JWT_SECRET),
  };
};

export const createSocialAccount = async (rest: { social: string; id: string; userId: string }) =>
  await MongoOrb('SocialCollection').createWithAutoFields('_id')({
    socialId: `${rest.social}|${rest.id}`,
    userId: rest.userId,
  });

export const addUserAndConnectSocial = async ({
  id,
  social,
  username,
  fullName,
  avatarUrl,
}: {
  id: string;
  username: string | null;
  social: SocialKind;
  fullName: string;
  avatarUrl: string;
}) => {
  if (!username) throw new Error('username and email both cannot be null');

  const foundSocial = await MongoOrb('SocialCollection').collection.findOne({ socialId: `${social}|${id}` });
  if (foundSocial) {
    const refreshTokenId = (
      await MongoOrb('RefreshTokenCollection').createWithAutoFields('_id')({
        userId: foundSocial.userId,
      })
    ).insertedId;
    return { id: foundSocial.userId, refreshTokenId: refreshTokenId, register: false };
  }

  const foundUser = await MongoOrb('UserCollection').collection.findOne({ username });
  if (!foundUser) {
    const createdUser = await MongoOrb('UserCollection').createWithAutoFields(
      '_id',
      'createdAt',
    )({
      username,
      emailConfirmed: true,
      fullName,
      avatarUrl,
    });
    await MongoOrb('SocialCollection').createWithAutoFields(
      '_id',
      'createdAt',
    )({
      socialId: `${social}|${id}`,
      userId: createdUser.insertedId,
    });
    const createdRefreshToken = await MongoOrb('RefreshTokenCollection').createWithAutoFields('_id')({
      userId: createdUser.insertedId,
    });
    return { id: createdUser.insertedId, refreshTokenId: createdRefreshToken.insertedId, register: true };
  }
  const refreshTokenId = (
    await MongoOrb('RefreshTokenCollection').createWithAutoFields('_id')({
      userId: foundUser._id,
    })
  ).insertedId;

  if (!foundSocial) {
    await MongoOrb('SocialCollection').createWithAutoFields(
      '_id',
      'createdAt',
    )({
      socialId: `${social}|${id}`,
      userId: foundUser._id,
    });
    return { id: foundUser._id, refreshTokenId: refreshTokenId, register: false };
  }
  throw new Error('Undefined Error. Cannot create social connection to user account');
};
