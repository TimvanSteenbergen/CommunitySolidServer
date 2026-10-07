"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFileStorage = void 0;
const fs_extra_1 = require("fs-extra");
const SystemError_1 = require("../../util/errors/SystemError");
/**
 * Uses a JSON file to store key/value pairs.
 */
class JsonFileStorage {
    filePath;
    locker;
    lockIdentifier;
    constructor(filePath, locker) {
        this.filePath = filePath;
        this.locker = locker;
        // Using file path as identifier for the lock as it should be unique for this file
        this.lockIdentifier = { path: filePath };
    }
    async get(key) {
        const json = await this.getJsonSafely();
        return json[key];
    }
    async has(key) {
        const json = await this.getJsonSafely();
        return typeof json[key] !== 'undefined';
    }
    async set(key, value) {
        return this.updateJsonSafely((json) => {
            json[key] = value;
            return this;
        });
    }
    async delete(key) {
        return this.updateJsonSafely((json) => {
            if (typeof json[key] !== 'undefined') {
                delete json[key];
                return true;
            }
            return false;
        });
    }
    async *entries() {
        const json = await this.getJsonSafely();
        yield* Object.entries(json);
    }
    /**
     * Acquires the data in the JSON file while using a read lock.
     */
    async getJsonSafely() {
        return this.locker.withReadLock(this.lockIdentifier, this.getJson.bind(this));
    }
    /**
     * Updates the data in the JSON file while using a write lock.
     *
     * @param updateFn - A function that updates the JSON object.
     *
     * @returns The return value of `updateFn`.
     */
    async updateJsonSafely(updateFn) {
        return this.locker.withWriteLock(this.lockIdentifier, async () => {
            const json = await this.getJson();
            const result = updateFn(json);
            await (0, fs_extra_1.writeJson)(this.filePath, json, { encoding: 'utf8', spaces: 2 });
            return result;
        });
    }
    /**
     * Reads and parses the data from the JSON file (without locking).
     */
    async getJson() {
        try {
            return await (0, fs_extra_1.readJson)(this.filePath, 'utf8');
        }
        catch (error) {
            if ((0, SystemError_1.isSystemError)(error) && error.code === 'ENOENT') {
                return {};
            }
            throw error;
        }
    }
}
exports.JsonFileStorage = JsonFileStorage;
//# sourceMappingURL=JsonFileStorage.js.map