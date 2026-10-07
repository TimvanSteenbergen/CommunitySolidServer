"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryMapStorage = void 0;
/**
 * A {@link KeyValueStorage} which uses a JavaScript Map for internal storage.
 */
class MemoryMapStorage {
    data;
    constructor() {
        this.data = new Map();
    }
    async get(key) {
        return this.data.get(key);
    }
    async has(key) {
        return this.data.has(key);
    }
    async set(key, value) {
        this.data.set(key, value);
        return this;
    }
    async delete(key) {
        return this.data.delete(key);
    }
    async *entries() {
        for (const entry of this.data.entries()) {
            yield entry;
        }
    }
}
exports.MemoryMapStorage = MemoryMapStorage;
//# sourceMappingURL=MemoryMapStorage.js.map