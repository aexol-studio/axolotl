/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Scalars = {
  ['ID']: unknown;
};

export type Models<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {
  ['Query']: {
    user: {
      args: Record<string, never>;
    };
  };
  ['Mutation']: {
    user: {
      args: Record<string, never>;
    };
  };
  ['AuthorizedUserQuery']: {
    _: {
      args: Record<string, never>;
    };
  };
  ['AuthorizedUserMutation']: {
    _: {
      args: Record<string, never>;
    };
  };
};

export type Directives<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {
  resolver: {
    args: Record<string, never>;
  };
};

export interface Query<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  user?: AuthorizedUserQuery | undefined | null;
}
export interface Mutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  user?: AuthorizedUserMutation | undefined | null;
}
export interface AuthorizedUserQuery<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _?: string | undefined | null;
}
export interface AuthorizedUserMutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _?: string | undefined | null;
}
