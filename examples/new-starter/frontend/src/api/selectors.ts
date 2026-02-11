import { Selector, type FromSelector } from '../zeus/index.js';

export const todoSelector = Selector('Todo')({
  _id: true,
  content: true,
  done: true,
});

export type TodoType = FromSelector<typeof todoSelector, 'Todo'>;

export const userSelector = Selector('User')({
  _id: true,
  username: true,
});

export type UserType = FromSelector<typeof userSelector, 'User'>;
