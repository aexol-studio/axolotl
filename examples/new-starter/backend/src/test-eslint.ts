/* eslint-disable @typescript-eslint/no-unused-vars */

export type Secret = unknown;

export type Scalars = {
  ['Secret']: unknown;
};

export type Models<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {
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
    secret: {
      args: Record<string, never>;
    };
  };
  ['TodoOps']: {
    markDone: {
      args: Record<string, never>;
    };
  };
  ['User']: {
    _id: {
      args: Record<string, never>;
    };
    username: {
      args: Record<string, never>;
    };
  };
  ['AuthorizedUserMutation']: {
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
  ['AuthorizedUserQuery']: {
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
  ['Subscription']: {
    countdown: {
      args: {
        from: number;
      };
    };
  };
  ['Query']: {
    user: {
      args: Record<string, never>;
    };
  };
};

export type Directives<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = unknown;

export interface Todo<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _id: string;
  content: string;
  done?: boolean | undefined | null;
  secret?: S['Secret'] | undefined | null;
}
export interface TodoOps<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  markDone?: boolean | undefined | null;
}
export interface User<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _id: string;
  username: string;
}
export interface AuthorizedUserMutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  createTodo: string;
  todoOps: TodoOps;
  changePassword?: boolean | undefined | null;
}
export interface AuthorizedUserQuery<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  todos?: Array<Todo> | undefined | null;
  todo: Todo;
  me: User;
}
export interface Mutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  user: AuthorizedUserMutation;
  login: string;
  register: string;
}
export interface Subscription<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  countdown: number;
}
export interface Query<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  user: AuthorizedUserQuery;
}
