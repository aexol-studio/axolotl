import type { YogaInitialContext } from 'graphql-yoga';

export type AuthUser = { _id: string; email: string; jti: string };

export interface AppContext extends YogaInitialContext {
  authUser?: AuthUser;
  setCookie: (token: string) => void;
  clearCookie: () => void;
}
