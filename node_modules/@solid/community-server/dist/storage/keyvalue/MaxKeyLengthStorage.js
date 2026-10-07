"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxKeyLengthStorage = void 0;
const node_crypto_1 = require("node:crypto");
const LogUtil_1 = require("../../logging/LogUtil");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
/**
 * A {@link KeyValueStorage} that hashes keys in case they would be longer than the set limit.
 * Hashed keys are prefixed with a certain value to prevent issues with incoming keys that are already hashed.
 * The default max length is 150 and the default prefix is `$hash$`.
 *
 * This class mostly exists to prevent issues when writing storage entries to disk.
 * Keys that are too long would cause issues with the file name limit.
 * For this reason, only the part after the last `/` in a key is hashed, to preserve the expected file structure.
 */
class MaxKeyLengthStorage {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    source;
    maxKeyLength;
    hashPrefix;
    constructor(source, maxKeyLength = 150, hashPrefix = '$hash$') {
        this.source = source;
        this.maxKeyLength = maxKeyLength;
        this.hashPrefix = hashPrefix;
    }
    async has(key) {
        return this.source.has(this.getKey(key));
    }
    async get(key) {
        return (await this.source.get(this.getKey(key)))?.payload;
    }
    async set(key, value) {
        await this.source.set(this.getKeyWithCheck(key), this.wrapPayload(key, value));
        return this;
    }
    async delete(key) {
        return this.source.delete(this.getKey(key));
    }
    async *entries() {
        for await (const [, val] of this.source.entries()) {
            yield [val.key, val.payload];
        }
    }
    wrapPayload(key, payload) {
        return { key, payload };
    }
    /**
     * Similar to `getKey` but checks to make sure the key does not already contain the prefix.
     * Only necessary for `set` calls.
     */
    getKeyWithCheck(key) {
        const parts = key.split('/');
        // Prevent non-hashed keys with the prefix to prevent false hits
        if (parts.at(-1)?.startsWith(this.hashPrefix)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Unable to store keys starting with ${this.hashPrefix}`);
        }
        return this.getKey(key, parts);
    }
    /**
     * Hashes the last part of the key if it is too long.
     * Otherwise, just returns the key.
     */
    getKey(key, parts) {
        if (key.length <= this.maxKeyLength) {
            return key;
        }
        // Hash the key if it is too long
        parts = parts ?? key.split('/');
        const last = parts.length - 1;
        parts[last] = `${this.hashPrefix}${(0, node_crypto_1.createHash)('sha256').update(parts[last]).digest('hex')}`;
        const newKey = parts.join('/');
        this.logger.debug(`Hashing key ${key} to ${newKey}`);
        return newKey;
    }
}
exports.MaxKeyLengthStorage = MaxKeyLengthStorage;
//# sourceMappingURL=MaxKeyLengthStorage.js.map