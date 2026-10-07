"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base64EncodingStorage = void 0;
const PassthroughKeyValueStorage_1 = require("./PassthroughKeyValueStorage");
/**
 * Encodes the input key with base64 encoding,
 * to make sure there are no invalid or special path characters.
 */
class Base64EncodingStorage extends PassthroughKeyValueStorage_1.PassthroughKeyValueStorage {
    constructor(source) {
        super(source);
    }
    toNewKey(key) {
        return Buffer.from(key).toString('base64');
    }
    toOriginalKey(key) {
        // While the main part of a base64 encoded string is same from any changes from encoding or decoding URL parts,
        // the `=` symbol that is used for padding is not.
        // This can cause incorrect results when calling these function,
        // where the original path contains `YXBwbGU%3D` instead of `YXBwbGU=`.
        // This does not create any issues when the source store does not encode the string, so is safe to always call.
        // For consistency, we might want to also always encode when creating the path in `keyToPath()`,
        // but that would potentially break existing implementations that do not do encoding,
        // and is not really necessary to solve any issues.
        return Buffer.from(decodeURIComponent(key), 'base64').toString('utf-8');
    }
}
exports.Base64EncodingStorage = Base64EncodingStorage;
//# sourceMappingURL=Base64EncodingStorage.js.map