import { createResolvers } from '@/src/modules/users/axolotl.js';
import { UsersModule } from '@/src/modules/users/functions/users.js';
import { getEnv } from '@/src/modules/users/utils.js';
import { google } from 'googleapis';

export default (fns: {
  sendMailForgotPassword: Parameters<typeof UsersModule.requestForgotPassword>[0]['sendMailForgotPassword'];
}) =>
  createResolvers({
    PublicUsersQuery: {
      login: async () => ({}),
      getAppleOAuthLink: async (input, { setup }) => {
        const scopesWithPrefix = (setup.scopes || [])
          .filter((scope) => scope !== null && scope !== undefined)
          .map((scope) => `${scope}`);
        const allScopes = [...scopesWithPrefix];
        const authorizationUrl = `https://appleid.apple.com/auth/authorize?response_type=code&redirect_uri=${
          setup.redirectUri ? setup.redirectUri : getEnv('APPLE_REDIRECT_URI')
        }${setup.state ? '&state=' + setup.state : ``}&client_id=${getEnv('APPLE_CLIENT_ID')}&scope=${allScopes.join(' ')}`;
        return authorizationUrl;
      },
      getGithubOAuthLink: async (input, { setup }) => {
        let authorizationUrl = 'https://github.com/login/oauth/authorize?scope=user:email%20read:user';
        if (Array.isArray(setup.scopes) && setup.scopes.length > 0) {
          setup.scopes.forEach((scope) => {
            authorizationUrl += '%20' + scope;
          });
        }
        return (
          authorizationUrl +
          `&client_id=${getEnv('GITHUB_APPLICATION_CLIENT_ID')}${setup.state ? '&state=' + setup.state : ``}&redirect_uri=${
            setup.redirectUri ? setup.redirectUri : getEnv('GITHUB_REDIRECT_URI')
          }`
        );
      },
      getGoogleOAuthLink: async (input, { setup }) => {
        const scopesWithPrefix = (setup.scopes || [])
          .filter((scope) => scope !== null && scope !== undefined)
          .map((scope) => `https://www.googleapis.com/auth/${scope}`);
        const allScopes = ['https://www.googleapis.com/auth/userinfo.email', ...scopesWithPrefix];

        const oauth2Client = new google.auth.OAuth2({
          clientId: getEnv('GOOGLE_CLIENT_ID'),
          redirectUri: setup.redirectUri ? setup.redirectUri : getEnv('GOOGLE_REDIRECT_URI'),
          clientSecret: getEnv('GOOGLE_SECRET_KEY'),
        });
        const authorizationUrl = oauth2Client.generateAuthUrl({
          access_type: 'online',
          scope: allScopes,
          include_granted_scopes: true,
          state: setup.state ? (setup.state as string) : ``,
        });
        return authorizationUrl;
      },
      getMicrosoftOAuthLink: async (input, { setup }) => {
        let scopes = `&scope=openid%20profile%20email%20https%3A%2F%2Fgraph.microsoft.com%2Fuser.read`;
        if (Array.isArray(setup.scopes) && setup.scopes.length > 0) {
          setup.scopes.forEach((scope) => {
            scopes += '%20' + scope;
          });
        }

        const authUrl =
          'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?' +
          `client_id=${getEnv('MICROSOFT_APPLICATION_CLIENT_ID')}` +
          `&response_type=code` +
          `&redirect_uri=${getEnv('MICROSOFT_REDIRECT_URI')}` +
          scopes +
          (setup.state ? '&state=' + setup.state : ``);
        return authUrl;
      },
      requestForForgotPassword: async (input, args) => {
        return UsersModule.requestForgotPassword({
          sendMailForgotPassword: fns.sendMailForgotPassword,
          username: args.username,
        });
      },
    },
  });
