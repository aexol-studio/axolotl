/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Scalars = unknown;

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
  ['User']: {
    _id: {
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
};

export type Directives<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = unknown;

export interface Todo<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _id: string;
  content: string;
  done?: boolean | undefined | null;
}
export interface User<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _id: string;
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
