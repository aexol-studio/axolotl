/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Scalars = {
  ['ID']: unknown;
};

export enum NoteStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface CreateNoteInput<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  content: string;
  status?: NoteStatus | undefined | null;
}

export type Models<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = {
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
  ['AuthorizedUserQuery']: {
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
};

export type Directives<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> = unknown;

export interface Note<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  id: S['ID'];
  content: string;
  status: NoteStatus;
  createdAt: string;
  updatedAt: string;
}
export interface AuthorizedUserQuery<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  notes: Array<Note>;
  note?: Note | undefined | null;
}
export interface AuthorizedUserMutation<S extends { [P in keyof Scalars]: any } = { [P in keyof Scalars]: any }> {
  createNote: Note;
  deleteNote: boolean;
}
