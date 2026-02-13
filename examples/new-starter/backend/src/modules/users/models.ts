/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Scalars = {
  ['ID']: unknown;
};

export interface AIChatMessage<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  role: string;
  content: string;
}

export type Models<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {
  ['User']: {
    _id: {
      args: Record<string, never>;
    };
    email: {
      args: Record<string, never>;
    };
  };
  ['Mutation']: {
    login: {
      args: {
        email: string;
        password: string;
      };
    };
    register: {
      args: {
        email: string;
        password: string;
      };
    };
  };
  ['AuthorizedUserMutation']: {
    changePassword: {
      args: {
        oldPassword: string;
        newPassword: string;
      };
    };
  };
  ['AuthorizedUserQuery']: {
    me: {
      args: Record<string, never>;
    };
  };
  ['AIChatChunk']: {
    content: {
      args: Record<string, never>;
    };
    done: {
      args: Record<string, never>;
    };
  };
  ['Subscription']: {
    countdown: {
      args: {
        from?: number | undefined | null;
      };
    };
    aiChat: {
      args: {
        messages: Array<AIChatMessage>;
        system?: string | undefined | null;
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
  email: string;
}
export interface Mutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  login: string;
  register: string;
}
export interface AuthorizedUserMutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  changePassword?: boolean | undefined | null;
}
export interface AuthorizedUserQuery<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  me: User;
}
export interface AIChatChunk<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  content: string;
  done: boolean;
}
export interface Subscription<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  countdown?: number | undefined | null;
  aiChat: AIChatChunk;
}
