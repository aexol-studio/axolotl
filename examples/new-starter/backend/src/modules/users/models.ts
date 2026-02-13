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
    createdAt: {
      args: Record<string, never>;
    };
  };
  ['Session']: {
    _id: {
      args: Record<string, never>;
    };
    userAgent: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
    expiresAt: {
      args: Record<string, never>;
    };
    isCurrent: {
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
    revokeSession: {
      args: {
        sessionId: string;
      };
    };
    revokeAllSessions: {
      args: Record<string, never>;
    };
    deleteAccount: {
      args: {
        password: string;
      };
    };
  };
  ['AuthorizedUserQuery']: {
    me: {
      args: Record<string, never>;
    };
    sessions: {
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
  createdAt: string;
}
export interface Session<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _id: string;
  userAgent?: string | undefined | null;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}
export interface Mutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  login: string;
  register: string;
}
export interface AuthorizedUserMutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  changePassword?: boolean | undefined | null;
  revokeSession?: boolean | undefined | null;
  revokeAllSessions?: boolean | undefined | null;
  deleteAccount?: boolean | undefined | null;
}
export interface AuthorizedUserQuery<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  me: User;
  sessions: Array<Session>;
}
export interface AIChatChunk<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  content: string;
  done: boolean;
}
export interface Subscription<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  countdown?: number | undefined | null;
  aiChat: AIChatChunk;
}
