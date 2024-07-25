import { createResolvers } from '@/src/modules/users/axolotl.js';
import { ProviderErrors, ProviderLoginInput, SocialKind } from '@/src/modules/users/models.js';
import { addUserAndConnectSocial, getEnv, getJwtAndRefreshToken } from '@/src/modules/users/utils.js';

export default createResolvers({
  ProviderLoginQuery: {
    microsoft: async (input) => {
      const src = input[0] as ProviderLoginInput;
      const microsoftData = new URLSearchParams();
      microsoftData.append('code', src.code);
      microsoftData.append('grant_type', 'authorization_code');
      microsoftData.append('client_id', getEnv('MICROSOFT_APPLICATION_CLIENT_ID'));
      microsoftData.append('client_secret', getEnv('MICROSOFT_APPLICATION_CLIENT_SECRET'));
      microsoftData.append('redirect_uri', src?.redirectUri || getEnv('MICROSOFT_REDIRECT_URI'));

      const microsoftResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        body: microsoftData,
      }).then((response) => response.text());

      const { access_token } = JSON.parse(microsoftResponse);
      if (!access_token) return { hasError: ProviderErrors.CANNOT_RETRIVE_TOKEN_FROM_MICROSOFT };
      const profile = await getMicrosoftUserInfo('https://graph.microsoft.com/v1.0/me', access_token);
      if (!profile) return { hasError: ProviderErrors.CANNOT_RETRIVE_TOKEN_FROM_MICROSOFT };

      const { id, refreshTokenId, register } = await addUserAndConnectSocial({
        id: profile.id,
        username: profile.userPrincipalName || profile.mail,
        social: SocialKind.Microsoft,
        fullName: profile.login || profile.displayName || profile.userPrincipalName,
        avatarUrl: profile.avatar_url,
      });

      const { jwtToken, refreshToken } = getJwtAndRefreshToken(id, refreshTokenId);

      return {
        response: {
          jwt: jwtToken,
          accessToken: jwtToken,
          providerAccessToken: access_token,
          refreshToken,
          register,
        },
        __meta: {
          profile,
        },
      };
    },
    google: async (input) => {
      const src = input[0] as ProviderLoginInput;
      const code = src.code.replace(/%2F/i, '/');
      const googleData = new URLSearchParams();
      googleData.append('code', code);
      googleData.append('client_id', getEnv('GOOGLE_CLIENT_ID'));
      googleData.append('client_secret', getEnv('GOOGLE_SECRET_KEY'));
      googleData.append('redirect_uri', src?.redirectUri || getEnv('GOOGLE_REDIRECT_URI'));
      googleData.append('grant_type', 'authorization_code');

      const googleResponse = await fetch('https://accounts.google.com/o/oauth2/token', {
        method: 'POST',
        body: googleData,
      }).then((response) => response.json() as Record<string, any>);
      if (!googleResponse) throw new Error('token not generated');

      const googleProfile = await getUserInfo(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        googleResponse.access_token,
      );
      if (!googleProfile.id) return { hasError: ProviderErrors.CANNOT_RETRIVE_PROFILE_FROM_GOOGLE_TRY_REFRESH_TOKEN };
      const { id, refreshTokenId, register } = await addUserAndConnectSocial({
        id: googleProfile.id,
        username: googleProfile.email,
        social: SocialKind.Google,
        fullName: googleProfile.login || googleProfile.name,
        avatarUrl: googleProfile.avatar_url || googleProfile.picture,
      });

      const { jwtToken, refreshToken } = getJwtAndRefreshToken(id, refreshTokenId);

      return {
        jwt: jwtToken,
        accessToken: jwtToken,
        providerAccessToken: googleResponse.access_token,
        refreshToken,
        register,
      };
    },
    github: async (input) => {
      const src = input[0] as ProviderLoginInput;

      const githubData = new URLSearchParams();
      githubData.append('code', src.code);
      githubData.append('client_id', getEnv('GITHUB_APPLICATION_CLIENT_ID'));
      githubData.append('client_secret', getEnv('GITHUB_APPLICATION_CLIENT_SECRET'));
      githubData.append('redirect_uri', src?.redirectUri || getEnv('GITHUB_REDIRECT_URI'));

      const githubResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        body: githubData,
      }).then((response) => response.text());

      const github_access_token = githubResponse.split('&scope')[0].substring(13);
      const githubProfile = await getUserInfo('https://api.github.com/user', github_access_token);
      if (!githubProfile) return { hasError: ProviderErrors.CANNOT_RETRIVE_PROFILE_FROM_GOOGLE_TRY_REFRESH_TOKEN };

      const githubEmails = await getUserInfo('https://api.github.com/user/emails', github_access_token);
      if (!githubEmails.length)
        return { hasError: ProviderErrors.CANNOT_RETRIVE_PROFILE_FROM_GOOGLE_TRY_REFRESH_TOKEN };

      const primaryEmail = githubEmails.find(
        (email: { primary: boolean; email: string }) => email.primary === true,
      ).email;
      const email = githubProfile.email || primaryEmail;
      if (!email) return { hasError: ProviderErrors.CANNOT_FIND_EMAIL_FOR_THIS_PROFIL };
      const { id, refreshTokenId, register } = await addUserAndConnectSocial({
        id: githubProfile.id,
        username: email,
        social: SocialKind.Github,
        fullName: githubProfile.name || githubProfile.login,
        avatarUrl: githubProfile.avatar_url,
      });

      const { jwtToken, refreshToken } = getJwtAndRefreshToken(id, refreshTokenId);

      return {
        jwt: jwtToken,
        accessToken: jwtToken,
        providerAccessToken: github_access_token,
        refreshToken,
        register,
      };
    },
    apple: async (input) => {
      const src = input[0] as ProviderLoginInput;
      if (!src.code) return { hasError: ProviderErrors.CODE_IS_NOT_EXIST_IN_ARGS };
      const appleData = new URLSearchParams();
      appleData.append('code', src.code);
      appleData.append('grant_type', 'authorization_code');
      appleData.append('redirect_uri', src?.redirectUri || getEnv('APPLE_REDIRECT_URI'));
      appleData.append('client_secret', getEnv('APPLE_SECRET_KEY'));
      appleData.append('client_id', getEnv('APPLE_CLIENT_ID'));
      const appleResponse = await fetch('https://appleid.apple.com/auth/token', {
        method: 'POST',
        body: appleData,
      }).then((response) => response.json() as Record<string, any>);
      if (!appleResponse || !appleResponse.id_token)
        return { hasError: ProviderErrors.CANNOT_RETRIVE_USER_INFORMATION_FROM_APPLE };
      const appleProfile = jwtDecode<JwtPayload & { email?: string; login?: string; name: string; avatar_url: string }>(
        appleResponse.id_token,
      );
      if (!appleProfile.sub) return { hasError: ProviderErrors.CANNOT_RETRIVE_SUB_FIELD_FROM_JWT_TOKEN };
      //if (!appleProfile.email) return { hasError: ProviderErrors.NOT_VERIFIED_EMAIL_IN_APPLE_PROFILE };
      const { id, refreshTokenId, register } = await addUserAndConnectSocial({
        id: appleProfile.sub,
        username: appleProfile.email || 'AppleHideProfile_' + appleProfile.sub.slice(0, 6),
        social: SocialKind.Apple,
        fullName: appleProfile.login || appleProfile.name,
        avatarUrl: appleProfile.avatar_url,
      });

      const { jwtToken, refreshToken } = getJwtAndRefreshToken(id, refreshTokenId);

      return {
        jwt: jwtToken,
        accessToken: jwtToken,
        providerAccessToken: appleResponse.id_token,
        refreshToken,
        register,
      };
    },
  },
});

export interface JwtDecodeOptions {
  header?: boolean;
}

export interface JwtHeader {
  typ?: string;
  alg?: string;
  kid?: string;
}

export interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}

export class InvalidTokenError extends Error {}

InvalidTokenError.prototype.name = 'InvalidTokenError';

function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    atob(str).replace(/(.)/g, (m, p) => {
      let code = (p as string).charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = '0' + code;
      }
      return '%' + code;
    }),
  );
}

function base64UrlDecode(str: string) {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw new Error('base64 string is not of the correct length');
  }

  try {
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
}

function jwtDecode<T = JwtHeader>(token: string, options: JwtDecodeOptions & { header: true }): T;
function jwtDecode<T = JwtPayload>(token: string, options?: JwtDecodeOptions): T;
function jwtDecode<T = JwtHeader | JwtPayload>(token: string, options?: JwtDecodeOptions): T {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified: must be a string');
  }

  options ||= {};

  const pos = options.header === true ? 0 : 1;
  const part = token.split('.')[pos];

  if (typeof part !== 'string') {
    throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);
  }

  let decoded: string;
  try {
    decoded = base64UrlDecode(part);
  } catch (e) {
    throw new InvalidTokenError(
      `Invalid token specified: invalid base64 for part #${pos + 1} (${(e as Error).message})`,
    );
  }

  try {
    return JSON.parse(decoded) as T;
  } catch (e) {
    throw new InvalidTokenError(`Invalid token specified: invalid json for part #${pos + 1} (${(e as Error).message})`);
  }
}

const getUserInfo = async (url: string, token: string) =>
  fetch(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json() as Promise<Record<string, any>>);

const getMicrosoftUserInfo = async (url: string, token: string) =>
  fetch(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json() as Promise<Record<string, string>>);
