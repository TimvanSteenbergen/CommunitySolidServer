"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreedyReadWriteLocker = void 0;
const InternalServerError_1 = require("../errors/InternalServerError");
const BaseReadWriteLocker_1 = require("./BaseReadWriteLocker");
/**
 * A {@link BaseReadWriteLocker} that uses the same locker for the main lock and the count lock,
 * and uses a {@link KeyValueStorage} for keeping track of the counter.
 *
 * Since it is completely dependent on other implementations,
 * this locker is threadsafe if its inputs are as well.
 */
class GreedyReadWriteLocker extends BaseReadWriteLocker_1.BaseReadWriteLocker {
    storage;
    readSuffix;
    countSuffix;
    /**
     * @param locker - Used for creating read and write locks.
     * @param storage - Used for storing the amount of active read operations on a resource.
     * @param readSuffix - Used to generate the identifier for the lock that is applied when updating the counter.
     * @param countSuffix - Used to generate the identifier that will be used in the storage for storing the counter.
     */
    constructor(locker, storage, readSuffix = 'read', countSuffix = 'count') {
        super(locker, locker);
        this.storage = storage;
        this.readSuffix = readSuffix;
        this.countSuffix = countSuffix;
    }
    getCountLockIdentifier(identifier) {
        return { path: `${identifier.path}.${this.readSuffix}` };
    }
    /**
     * This key is used for storing the count of active read operations.
     */
    getCountKey(identifier) {
        return `${identifier.path}.${this.countSuffix}`;
    }
    /**
     * Updates the count with the given modifier.
     * Creates the data if it didn't exist yet.
     * Deletes the data when the count reaches zero.
     */
    async modifyCount(identifier, mod) {
        const countKey = this.getCountKey(identifier);
        let number = await this.storage.get(countKey) ?? 0;
        number += mod;
        if (number === 0) {
            // Make sure there is no remaining data once all locks are released
            await this.storage.delete(countKey);
        }
        else if (number > 0) {
            await this.storage.set(countKey, number);
        }
        else {
            // Failsafe in case something goes wrong with the count storage
            throw new InternalServerError_1.InternalServerError('Read counter would become negative. Something is wrong with the count storage.');
        }
        return number;
    }
}
exports.GreedyReadWriteLocker = GreedyReadWriteLocker;
//# sourceMappingURL=GreedyReadWriteLocker.js.map