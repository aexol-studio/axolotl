import { Selector, type FromSelector } from '../zeus/index.js';
export { NoteStatus } from '../zeus/index.js';

export const todoSelector = Selector('Todo')({
  _id: true,
  content: true,
  done: true,
});

export type TodoType = FromSelector<typeof todoSelector, 'Todo'>;

export const userSelector = Selector('User')({
  _id: true,
  email: true,
  createdAt: true,
});

export type UserType = FromSelector<typeof userSelector, 'User'>;

export const sessionSelector = Selector('Session')({
  _id: true,
  userAgent: true,
  createdAt: true,
  expiresAt: true,
  isCurrent: true,
});

export type SessionType = FromSelector<typeof sessionSelector, 'Session'>;

export const noteSelector = Selector('Note')({
  id: true,
  content: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type NoteItem = FromSelector<typeof noteSelector, 'Note'>;
