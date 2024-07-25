import { MongoOrb } from '@/src/modules/users/orm.js';
import { decodeRefreshToken, getEnv } from '@/src/modules/users/utils.js';
import pkg from 'jsonwebtoken';
const { sign } = pkg;

export const refreshToken = async (args: { refreshToken: string }) => {
  const { sub, tokenId } = decodeRefreshToken(args.refreshToken);
  const refreshTokenObject = await MongoOrb('RefreshTokenCollection').collection.findOne({
    _id: tokenId,
    userId: sub,
  });
  if (!refreshTokenObject) throw new Error('Invalid token');

  const JWT_TOKEN_EXPIRATION_IN_SECONDS = process.env['JWT_TOKEN_EXPIRATION_IN_SECONDS'];
  const expiresIn = JWT_TOKEN_EXPIRATION_IN_SECONDS ? parseInt(JWT_TOKEN_EXPIRATION_IN_SECONDS) : 60 * 60 * 24;
  const jwtSecret = getEnv('JWT_SECRET');

  return sign({ userId: refreshTokenObject.userId }, jwtSecret, { expiresIn });
};
