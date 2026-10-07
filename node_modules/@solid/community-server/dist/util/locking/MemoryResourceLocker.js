"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryResourceLocker = void 0;
const async_lock_1 = __importDefault(require("async-lock"));
const LogUtil_1 = require("../../logging/LogUtil");
const InternalServerError_1 = require("../errors/InternalServerError");
/**
 * A resource locker making use of the `async-lock` library.
 * Note that all locks are kept in memory until they are unlocked which could potentially result
 * in a memory leak if locks are never unlocked, so make sure this is covered with expiring locks for example,
 * and/or proper `finally` handles.
 */
class MemoryResourceLocker {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    locker;
    unlockCallbacks;
    constructor() {
        this.locker = new async_lock_1.default();
        this.unlockCallbacks = {};
    }
    async acquire(identifier) {
        const { path } = identifier;
        this.logger.debug(`Acquiring lock for ${path}`);
        return new Promise((resolve) => {
            this.locker.acquire(path, (done) => {
                this.unlockCallbacks[path] = done;
                this.logger.debug(`Acquired lock for ${path}. ${this.getLockCount()} locks active.`);
                resolve();
            }, () => {
                delete this.unlockCallbacks[path];
                this.logger.debug(`Released lock for ${path}. ${this.getLockCount()} active locks remaining.`);
            });
        });
    }
    async release(identifier) {
        const { path } = identifier;
        if (!this.unlockCallbacks[path]) {
            throw new InternalServerError_1.InternalServerError(`Trying to unlock resource that is not locked: ${path}`);
        }
        this.unlockCallbacks[path]();
    }
    /**
     * Counts the number of active locks.
     */
    getLockCount() {
        return Object.keys(this.unlockCallbacks).length;
    }
}
exports.MemoryResourceLocker = MemoryResourceLocker;
//# sourceMappingURL=MemoryResourceLocker.js.map