"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EqualReadWriteLocker = void 0;
/**
 * A {@link ReadWriteLocker} that gives no priority to read or write operations: both use the same lock.
 */
class EqualReadWriteLocker {
    locker;
    constructor(locker) {
        this.locker = locker;
    }
    async withReadLock(identifier, whileLocked) {
        return this.withLock(identifier, whileLocked);
    }
    async withWriteLock(identifier, whileLocked) {
        return this.withLock(identifier, whileLocked);
    }
    /**
     * Acquires a new lock for the requested identifier.
     * Will resolve when the input function resolves.
     *
     * @param identifier - Identifier of resource that needs to be locked.
     * @param whileLocked - Function to resolve while the resource is locked.
     */
    async withLock(identifier, whileLocked) {
        await this.locker.acquire(identifier);
        try {
            return await whileLocked();
        }
        finally {
            await this.locker.release(identifier);
        }
    }
}
exports.EqualReadWriteLocker = EqualReadWriteLocker;
//# sourceMappingURL=EqualReadWriteLocker.js.map