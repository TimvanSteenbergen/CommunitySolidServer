"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrappedExpiringReadWriteLocker = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const InternalServerError_1 = require("../errors/InternalServerError");
/**
 * Wraps around an existing {@link ReadWriteLocker} and adds expiration logic to prevent locks from getting stuck.
 */
class WrappedExpiringReadWriteLocker {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    locker;
    expiration;
    /**
     * @param locker - Instance of ResourceLocker to use for acquiring a lock.
     * @param expiration - Time in ms after which the lock expires.
     */
    constructor(locker, expiration) {
        this.locker = locker;
        this.expiration = expiration;
    }
    async withReadLock(identifier, whileLocked) {
        return this.locker.withReadLock(identifier, async () => this.expiringPromise(identifier, whileLocked));
    }
    async withWriteLock(identifier, whileLocked) {
        return this.locker.withWriteLock(identifier, async () => this.expiringPromise(identifier, whileLocked));
    }
    /**
     * Creates a Promise that either resolves the given input function or rejects if time runs out,
     * whichever happens first. The input function can reset the timer by calling the `maintainLock` function
     * it receives. The ResourceIdentifier is only used for logging.
     */
    async expiringPromise(identifier, whileLocked) {
        let timer;
        let createTimeout;
        // Promise that throws an error when the timer finishes
        const timerPromise = new Promise((resolve, reject) => {
            // Starts the timer that will cause this promise to error after a given time
            createTimeout = () => setTimeout(() => {
                this.logger.error(`Lock expired after ${this.expiration}ms on ${identifier.path}`);
                reject(new InternalServerError_1.InternalServerError(`Lock expired after ${this.expiration}ms on ${identifier.path}`));
            }, this.expiration);
            timer = createTimeout();
        });
        // Restarts the timer
        const renewTimer = () => {
            this.logger.verbose(`Renewed expiring lock on ${identifier.path}`);
            clearTimeout(timer);
            timer = createTimeout();
        };
        // Runs the main function and cleans up the timer afterwards
        async function runWithTimeout() {
            try {
                return await whileLocked(renewTimer);
            }
            finally {
                clearTimeout(timer);
            }
        }
        return Promise.race([timerPromise, runWithTimeout()]);
    }
}
exports.WrappedExpiringReadWriteLocker = WrappedExpiringReadWriteLocker;
//# sourceMappingURL=WrappedExpiringReadWriteLocker.js.map