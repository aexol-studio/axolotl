import { Todo } from "./models.js";
export type TodoModel = Todo & {
    owner: string;
};
export declare const db: {
    todos: TodoModel[];
};
