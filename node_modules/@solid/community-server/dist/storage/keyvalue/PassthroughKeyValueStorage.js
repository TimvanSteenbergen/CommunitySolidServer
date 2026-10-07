"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassthroughKeyValueStorage = void 0;
/**
 * Abstract class to create a {@link KeyValueStorage} by wrapping around another one.
 *
 * Exposes abstract functions to modify the key before passing it to the the source storage.
 */
class PassthroughKeyValueStorage {
    source;
    constructor(source) {
        this.source = source;
    }
    async get(key) {
        const path = this.toNewKey(key);
        return this.source.get(path);
    }
    async has(key) {
        const path = this.toNewKey(key);
        return this.source.has(path);
    }
    async set(key, value) {
        const path = this.toNewKey(key);
        await this.source.set(path, value);
        return this;
    }
    async delete(key) {
        const path = this.toNewKey(key);
        return this.source.delete(path);
    }
    async *entries() {
        for await (const [path, value] of this.source.entries()) {
            const key = this.toOriginalKey(path);
            yield [key, value];
        }
    }
}
exports.PassthroughKeyValueStorage = PassthroughKeyValueStorage;
//# sourceMappingURL=PassthroughKeyValueStorage.js.map