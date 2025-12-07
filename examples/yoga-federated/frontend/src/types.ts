export type Todo = {
  _id: string;
  content: string;
  done?: boolean | null;
};

export type User = {
  _id: string;
  username: string;
};

export type AuthMode = 'login' | 'register';
