/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Secret = unknown;

export type Scalars = {
  ['ID']: unknown;
  ['Secret']: unknown;
};

export enum TodoUpdateType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
}

export interface AIChatMessage<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  role: string;
  content: string;
}

export type Models<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {
  ['Query']: {
    user: {
      args: Record<string, never>;
    };
  };
  ['Todo']: {
    _id: {
      args: Record<string, never>;
    };
    content: {
      args: Record<string, never>;
    };
    done: {
      args: Record<string, never>;
    };
  };
  ['TodoOps']: {
    markDone: {
      args: Record<string, never>;
    };
  };
  ['TodoUpdate']: {
    type: {
      args: Record<string, never>;
    };
    todo: {
      args: Record<string, never>;
    };
  };
  ['Mutation']: {
    user: {
      args: Record<string, never>;
    };
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
  ['AuthorizedUserQuery']: {
    _: {
      args: Record<string, never>;
    };
    todos: {
      args: Record<string, never>;
    };
    todo: {
      args: {
        _id: string;
      };
    };
    me: {
      args: Record<string, never>;
    };
  };
  ['AuthorizedUserMutation']: {
    _: {
      args: Record<string, never>;
    };
    createTodo: {
      args: {
        content: string;
        secret?: S['Secret'] | undefined | null;
      };
    };
    todoOps: {
      args: {
        _id: string;
      };
    };
    changePassword: {
      args: {
        newPassword: string;
      };
    };
  };
  ['Subscription']: {
    todoUpdates: {
      args: {
        ownerId: string;
      };
    };
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
  ['User']: {
    _id: {
      args: Record<string, never>;
    };
    email: {
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
};

export type Directives<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {
  resolver: {
    args: Record<string, never>;
  };
};

export interface Query<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  user?: AuthorizedUserQuery | undefined | null;
}
export interface Todo<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _id: string;
  content: string;
  done?: boolean | undefined | null;
}
export interface TodoOps<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  markDone?: boolean | undefined | null;
}
export interface TodoUpdate<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  type: TodoUpdateType;
  todo: Todo;
}
export interface Mutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  user?: AuthorizedUserMutation | undefined | null;
  login: string;
  register: string;
}
export interface AuthorizedUserQuery<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _?: string | undefined | null;
  todos?: Array<Todo> | undefined | null;
  todo: Todo;
  me: User;
}
export interface AuthorizedUserMutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _?: string | undefined | null;
  createTodo: string;
  todoOps: TodoOps;
  changePassword?: boolean | undefined | null;
}
export interface Subscription<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  todoUpdates: TodoUpdate;
  countdown?: number | undefined | null;
  aiChat: AIChatChunk;
}
export interface User<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _id: string;
  email: string;
}
export interface AIChatChunk<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  content: string;
  done: boolean;
}
