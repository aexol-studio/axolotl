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
  };
  ['TodoOps']: {
    markDone: {
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
  };
  ['TodoUpdate']: {
    type: {
      args: Record<string, never>;
    };
    todo: {
      args: Record<string, never>;
    };
  };
  ['Subscription']: {
    todoUpdates: {
      args: {
        ownerId: string;
      };
    };
  };
};

export type Directives<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {
  resolver: {
    args: Record<string, never>;
  };
};

export interface Todo<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _id: string;
  content: string;
  done?: boolean | undefined | null;
}
export interface TodoOps<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  markDone?: boolean | undefined | null;
}
export interface AuthorizedUserMutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  createTodo: string;
  todoOps: TodoOps;
}
export interface AuthorizedUserQuery<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  todos?: Array<Todo> | undefined | null;
  todo: Todo;
}
export interface TodoUpdate<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  type: TodoUpdateType;
  todo: Todo;
}
export interface Subscription<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  todoUpdates: TodoUpdate;
}
