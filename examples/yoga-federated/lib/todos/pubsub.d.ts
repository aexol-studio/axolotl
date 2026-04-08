import { Todo } from './models.js';
export type TodoUpdateType = 'CREATED' | 'UPDATED';
export interface TodoUpdate {
    type: TodoUpdateType;
    todo: Todo;
    ownerId: string;
}
type TodoUpdateCallback = (update: TodoUpdate) => void;
declare class TodoPubSub {
    private subscribers;
    subscribe(ownerId: string, callback: TodoUpdateCallback): () => void;
    publish(update: TodoUpdate): void;
}
export declare const todoPubSub: TodoPubSub;
export {};
