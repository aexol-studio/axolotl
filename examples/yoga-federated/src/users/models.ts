/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Scalars = {
  ['ID']: unknown;
};

export type Models<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {
  ['User']: {
    _id: {
      args: Record<string, never>;
    };
    username: {
      args: Record<string, never>;
    };
  };
  ['Mutation']: {
    user: {
      args: Record<string, never>;
    };
    login: {
      args: {
        username: string;
        password: string;
      };
    };
    register: {
      args: {
        username: string;
        password: string;
      };
    };
  };
  ['Query']: {
    user: {
      args: Record<string, never>;
    };
  };
  ['AuthorizedUserMutation']: {
    changePassword: {
      args: {
        newPassword: string;
      };
    };
  };
  ['AuthorizedUserQuery']: {
    me: {
      args: Record<string, never>;
    };
  };
  ['Subscription']: {
    countdown: {
      args: {
        from?: number | undefined | null;
      };
    };
  };
};

export type Directives<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {
  resolver: {
    args: Record<string, never>;
  };
};

export interface User<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _id: string;
  username: string;
}
export interface Mutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  user: AuthorizedUserMutation;
  login: string;
  register: string;
}
export interface Query<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  user: AuthorizedUserQuery;
}
export interface AuthorizedUserMutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  changePassword?: boolean | undefined | null;
}
export interface AuthorizedUserQuery<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  me: User;
}
export interface Subscription<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  countdown?: number | undefined | null;
}
