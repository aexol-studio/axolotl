class TodoPubSub {
    subscribers = new Map();
    subscribe(ownerId, callback) {
        if (!this.subscribers.has(ownerId)) {
            this.subscribers.set(ownerId, new Set());
        }
        this.subscribers.get(ownerId).add(callback);
        return () => {
            this.subscribers.get(ownerId)?.delete(callback);
            if (this.subscribers.get(ownerId)?.size === 0) {
                this.subscribers.delete(ownerId);
            }
        };
    }
    publish(update) {
        const callbacks = this.subscribers.get(update.ownerId);
        if (callbacks) {
            callbacks.forEach((callback) => callback(update));
        }
    }
}
export const todoPubSub = new TodoPubSub();
//# sourceMappingURL=pubsub.js.map