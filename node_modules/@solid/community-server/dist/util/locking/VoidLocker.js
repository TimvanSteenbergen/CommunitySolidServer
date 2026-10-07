"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoidLocker = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
/**
 * This locker will execute the whileLocked function without any locking mechanism
 *
 * Do not use this locker in combination with storages that doesn't handle concurrent read/writes gracefully
 */
function noop() { }
class VoidLocker {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor() {
        this.logger.warn('Locking mechanism disabled; data integrity during parallel requests not guaranteed.');
    }
    async withReadLock(identifier, whileLocked) {
        return whileLocked(noop);
    }
    async withWriteLock(identifier, whileLocked) {
        return whileLocked(noop);
    }
}
exports.VoidLocker = VoidLocker;
//# sourceMappingURL=VoidLocker.js.map