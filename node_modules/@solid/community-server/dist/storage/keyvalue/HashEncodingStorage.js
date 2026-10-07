"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashEncodingStorage = void 0;
const node_crypto_1 = require("node:crypto");
const LogUtil_1 = require("../../logging/LogUtil");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const PassthroughKeyValueStorage_1 = require("./PassthroughKeyValueStorage");
/**
 * Encodes the input key with SHA-256 hashing,
 * to make sure there are no invalid or special path characters.
 *
 * This class was created specifically to prevent the issue of identifiers being too long when storing data:
 * https://github.com/CommunitySolidServer/CommunitySolidServer/issues/1013
 *
 * This should eventually be replaced by a more structural approach once internal storage has been refactored
 * and data migration from older versions and formats is supported.
 */
class HashEncodingStorage extends PassthroughKeyValueStorage_1.PassthroughKeyValueStorage {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor(source) {
        super(source);
    }
    toNewKey(key) {
        const hash = (0, node_crypto_1.createHash)('sha256').update(key).digest('hex');
        this.logger.debug(`Hashing key ${key} to ${hash}`);
        return hash;
    }
    toOriginalKey() {
        throw new NotImplementedHttpError_1.NotImplementedHttpError('Hash keys cannot be converted back.');
    }
}
exports.HashEncodingStorage = HashEncodingStorage;
//# sourceMappingURL=HashEncodingStorage.js.map