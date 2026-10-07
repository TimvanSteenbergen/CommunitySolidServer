"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartialReadWriteLocker = void 0;
const BaseReadWriteLocker_1 = require("./BaseReadWriteLocker");
const MemoryResourceLocker_1 = require("./MemoryResourceLocker");
/**
 * A {@link BaseReadWriteLocker} that stores the counter and its associated locks in memory.
 * The consequence of this is that multiple read requests are possible as long as they occur on the same worker thread.
 * A read request from a different worker thread will have to wait
 * until those from the current worker thread are finished.
 *
 * The main reason for this class is due to the file locker that we use only allowing locks to be released
 * by the same worker thread that acquired them.
 */
class PartialReadWriteLocker extends BaseReadWriteLocker_1.BaseReadWriteLocker {
    readCount;
    constructor(locker) {
        // This goes against how we generally link classes together using Components.js.
        // The reason for doing this is that `MemoryResourceLocker` implements `SingleThreaded`,
        // meaning that when the server is started with worker threads an error will be thrown by Components.js.
        // Instantiating it here "hides" it from Components.js.
        // If at some point in the future this causes issues because we want to split up the code,
        // this should not be blocking and an alternative solution should be used,
        // such as removing the SingleThreaded interface from the locker.
        super(locker, new MemoryResourceLocker_1.MemoryResourceLocker());
        this.readCount = new Map();
    }
    getCountLockIdentifier(identifier) {
        return identifier;
    }
    modifyCount(identifier, mod) {
        const modified = (this.readCount.get(identifier.path) ?? 0) + mod;
        if (modified === 0) {
            this.readCount.delete(identifier.path);
        }
        else {
            this.readCount.set(identifier.path, modified);
        }
        return modified;
    }
}
exports.PartialReadWriteLocker = PartialReadWriteLocker;
//# sourceMappingURL=PartialReadWriteLocker.js.map