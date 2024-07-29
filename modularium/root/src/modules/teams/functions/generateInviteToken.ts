import crypto from 'crypto';
import { MongoOrb } from '@/src/modules/teams/orm.js';
import { GenerateInviteTokenError } from '@/src/modules/teams/models.js';
import { getEnv } from '@/src/modules/teams/functions/utils.js';

export const genRandomString = (length: number) =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);

export const generateInviteToken = async ({
  domain,
  expires,
  userId,
  teamId,
  name,
}: {
  domain?: string;
  expires?: string;
  userId: string;
  teamId?: string;
  name?: string;
}) => {
  domain = domain || '';
  expires = expires
    ? new Date(expires).setDate(new Date(expires).getDate() + 1).toString()
    : new Date().setDate(new Date().getDate() + Number(getEnv('INVITE_TOKEN_EXPIRES_DAYS') || 3)).toString();
  let generatedToken: string;

  do {
    generatedToken = genRandomString(16);
  } while ((await MongoOrb('InviteTokenCollection').collection.findOne({ token: generatedToken })) !== null);

  if (teamId) {
    const userTeam = await MongoOrb('TeamCollection').collection.findOne({ owner: userId, _id: teamId });
    if (!userTeam) return { hasError: GenerateInviteTokenError.YOU_ARE_NOT_THE_OWNER_OF_A_TEAM_OR_TEAM_DOES_NOT_EXIST };
    await MongoOrb('InviteTokenCollection').createWithAutoFields('_id')({
      token: generatedToken,
      expires,
      domain,
      name,
      teamId: userTeam._id,
    });
    return { result: generatedToken };
  }

  await MongoOrb('InviteTokenCollection').createWithAutoFields('_id')({
    token: generatedToken,
    expires,
    domain,
    name,
  });

  return { result: generatedToken };
};
