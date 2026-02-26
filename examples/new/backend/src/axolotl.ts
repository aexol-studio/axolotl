import type { ServerResponse } from 'node:http';
import { Directives, Models, Scalars } from '@/src/models.js';
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaWithContextAdapter } from '@aexol/axolotl-graphql-yoga';
import { AppContext } from './context.js';
import { serializeClearCookie, serializeSetCookie } from './utils/cookies.js';
import { verifyAuth } from '@/src/modules/auth/lib/verifyAuth.js';

const yogaAdapter = graphqlYogaWithContextAdapter<AppContext>(async (initial) => {
  const cookieHeader = initial.request.headers.get('cookie');
  const tokenHeader = initial.request.headers.get('token');

  let authUser: AppContext['authUser'];
  try {
    authUser = await verifyAuth(cookieHeader, tokenHeader);
  } catch {
    authUser = undefined;
  }

  const res = (initial as typeof initial & { res?: ServerResponse }).res;

  const setCookie = (token: string) => {
    if (res) {
      res.setHeader('Set-Cookie', serializeSetCookie(token));
    }
  };

  const clearCookie = () => {
    if (res) {
      res.setHeader('Set-Cookie', serializeClearCookie());
    }
  };

  return { ...initial, authUser, setCookie, clearCookie };
});

export const { applyMiddleware, createResolvers, createDirectives, adapter } = Axolotl(yogaAdapter)<
  Models<{ Secret: number; ID: string }>,
  Scalars,
  Directives
>();
