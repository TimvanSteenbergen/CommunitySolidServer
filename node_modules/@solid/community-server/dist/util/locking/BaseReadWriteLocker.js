"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseReadWriteLocker = void 0;
const EqualReadWriteLocker_1 = require("./EqualReadWriteLocker");
/**
 * A {@link ReadWriteLocker} that allows for multiple simultaneous read operations.
 * Write operations will be blocked as long as read operations are not finished.
 * New read operations are allowed while this is going on, which will cause write operations to wait longer.
 *
 * Based on https://en.wikipedia.org/wiki/Readers%E2%80%93writer_lock#Using_two_mutexes .
 * As soon as 1 read lock request is made, the main lock is locked.
 * Internally a counter keeps track of the amount of active read locks.
 * Only when this number reaches 0 will the main lock be released again.
 * The internal count lock is only locked to increase/decrease this counter and is released afterwards.
 * This allows for multiple read operations, although only 1 at the time can update the counter,
 * which means there can still be a small waiting period if there are multiple simultaneous read operations.
 *
 * Classes extending this need to implement `getCountLockIdentifier` and `modifyCount`.
 */
class BaseReadWriteLocker extends EqualReadWriteLocker_1.EqualReadWriteLocker {
    countLocker;
    /**
     * @param resourceLocker - Used for creating read and write locks.
     * @param countLocker - Used for creating locks when updating the counter.
     */
    constructor(resourceLocker, countLocker) {
        super(resourceLocker);
        this.countLocker = countLocker;
    }
    async withReadLock(identifier, whileLocked) {
        await this.acquireReadLock(identifier);
        try {
            return await whileLocked();
        }
        finally {
            await this.releaseReadLock(identifier);
        }
    }
    /**
     * Safely updates the count before starting a read operation.
     */
    async acquireReadLock(identifier) {
        await this.withInternalCountLock(identifier, async () => {
            const count = await this.modifyCount(identifier, 1);
            if (count === 1) {
                await this.locker.acquire(identifier);
            }
        });
    }
    /**
     * Safely decreases the count after the read operation is finished.
     */
    async releaseReadLock(identifier) {
        await this.withInternalCountLock(identifier, async () => {
            const count = await this.modifyCount(identifier, -1);
            if (count === 0) {
                await this.locker.release(identifier);
            }
        });
    }
    /**
     * Safely runs an action on the count.
     */
    async withInternalCountLock(identifier, whileLocked) {
        const read = this.getCountLockIdentifier(identifier);
        await this.countLocker.acquire(read);
        try {
            return await whileLocked();
        }
        finally {
            await this.countLocker.release(read);
        }
    }
}
exports.BaseReadWriteLocker = BaseReadWriteLocker;
//# sourceMappingURL=BaseReadWriteLocker.js.map