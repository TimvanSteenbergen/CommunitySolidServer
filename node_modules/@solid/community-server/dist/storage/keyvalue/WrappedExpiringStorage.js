"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrappedExpiringStorage = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const TimerUtil_1 = require("../../util/TimerUtil");
/**
 * A storage that wraps around another storage and expires resources based on the given (optional) expiry date.
 * Will delete expired entries when trying to get their value.
 * Has a timer that will delete all expired data every hour (default value).
 */
class WrappedExpiringStorage {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    source;
    timer;
    /**
     * @param source - KeyValueStorage to actually store the data.
     * @param timeout - How often the expired data needs to be checked in minutes.
     */
    constructor(source, timeout = 60) {
        this.source = source;
        this.timer = (0, TimerUtil_1.setSafeInterval)(this.logger, 'Failed to remove expired entries', this.removeExpiredEntries.bind(this), timeout * 60 * 1000);
        this.timer.unref();
    }
    async get(key) {
        return this.getUnexpired(key);
    }
    async has(key) {
        return Boolean(await this.getUnexpired(key));
    }
    async set(key, value, expireValue) {
        const expires = typeof expireValue === 'number' ? new Date(Date.now() + expireValue) : expireValue;
        if (this.isExpired(expires)) {
            throw new InternalServerError_1.InternalServerError('Value is already expired');
        }
        await this.source.set(key, this.toExpires(value, expires));
        return this;
    }
    async delete(key) {
        return this.source.delete(key);
    }
    async *entries() {
        // Not deleting expired entries here to prevent iterator issues
        for await (const [key, value] of this.source.entries()) {
            const { expires, payload } = this.toData(value);
            if (!this.isExpired(expires)) {
                yield [key, payload];
            }
        }
    }
    /**
     * Deletes all entries that have expired.
     */
    async removeExpiredEntries() {
        this.logger.debug('Removing expired entries');
        const expired = [];
        for await (const [key, value] of this.source.entries()) {
            const { expires } = this.toData(value);
            if (this.isExpired(expires)) {
                expired.push(key);
            }
        }
        await Promise.all(expired.map(async (key) => this.source.delete(key)));
        this.logger.debug('Finished removing expired entries');
    }
    /**
     * Tries to get the data for the given key.
     * In case the data exists but has expired,
     * it will be deleted and `undefined` will be returned instead.
     */
    async getUnexpired(key) {
        const data = await this.source.get(key);
        if (!data) {
            return;
        }
        const { expires, payload } = this.toData(data);
        if (this.isExpired(expires)) {
            await this.source.delete(key);
            return;
        }
        return payload;
    }
    /**
     * Checks if the given data entry has expired.
     */
    isExpired(expires) {
        return typeof expires !== 'undefined' && expires < new Date();
    }
    /**
     * Creates a new object where the `expires` field is a string instead of a Date.
     */
    toExpires(data, expires) {
        return { expires: expires?.toISOString(), payload: data };
    }
    /**
     * Creates a new object where the `expires` field is a Date instead of a string.
     */
    toData(expireData) {
        const result = { payload: expireData.payload };
        if (expireData.expires) {
            result.expires = new Date(expireData.expires);
        }
        return result;
    }
}
exports.WrappedExpiringStorage = WrappedExpiringStorage;
//# sourceMappingURL=WrappedExpiringStorage.js.map