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
export enum NoteStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface AIChatMessage<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  role: string;
  content: string;
}
export interface CreateNoteInput<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  content: string;
  status?: NoteStatus | undefined | null;
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
  ['AIChatChunk']: {
    content: {
      args: Record<string, never>;
    };
    done: {
      args: Record<string, never>;
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
    sessions: {
      args: Record<string, never>;
    };
    notes: {
      args: Record<string, never>;
    };
    note: {
      args: {
        id: S['ID'];
      };
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
    createNote: {
      args: {
        input: CreateNoteInput;
      };
    };
    deleteNote: {
      args: {
        id: S['ID'];
      };
    };
  };
  ['Note']: {
    id: {
      args: Record<string, never>;
    };
    content: {
      args: Record<string, never>;
    };
    status: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
    updatedAt: {
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
export interface Subscription<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  todoUpdates: TodoUpdate;
  countdown?: number | undefined | null;
  aiChat: AIChatChunk;
}
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
export interface AIChatChunk<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  content: string;
  done: boolean;
}
export interface AuthorizedUserQuery<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _?: string | undefined | null;
  todos?: Array<Todo> | undefined | null;
  todo: Todo;
  me: User;
  sessions: Array<Session>;
  notes: Array<Note>;
  note?: Note | undefined | null;
}
export interface AuthorizedUserMutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  _?: string | undefined | null;
  createTodo: string;
  todoOps: TodoOps;
  changePassword?: boolean | undefined | null;
  revokeSession?: boolean | undefined | null;
  revokeAllSessions?: boolean | undefined | null;
  deleteAccount?: boolean | undefined | null;
  createNote: Note;
  deleteNote: boolean;
}
export interface Note<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  id: S['ID'];
  content: string;
  status: NoteStatus;
  createdAt: string;
  updatedAt: string;
}
