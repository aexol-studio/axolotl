import { Todo } from './models.js';

export type TodoUpdateType = 'CREATED' | 'UPDATED';

export interface TodoUpdate {
  type: TodoUpdateType;
  todo: Todo;
  ownerId: string;
}

type TodoUpdateCallback = (update: TodoUpdate) => void;

class TodoPubSub {
  private subscribers: Map<string, Set<TodoUpdateCallback>> = new Map();

  subscribe(ownerId: string, callback: TodoUpdateCallback): () => void {
    if (!this.subscribers.has(ownerId)) {
      this.subscribers.set(ownerId, new Set());
    }
    this.subscribers.get(ownerId)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.get(ownerId)?.delete(callback);
      if (this.subscribers.get(ownerId)?.size === 0) {
        this.subscribers.delete(ownerId);
      }
    };
  }

  publish(update: TodoUpdate): void {
    const callbacks = this.subscribers.get(update.ownerId);
    if (callbacks) {
      callbacks.forEach((callback) => callback(update));
    }
  }
}

export const todoPubSub = new TodoPubSub();
