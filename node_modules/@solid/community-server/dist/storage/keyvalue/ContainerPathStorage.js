"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerPathStorage = void 0;
const PathUtil_1 = require("../../util/PathUtil");
const PassthroughKeyValueStorage_1 = require("./PassthroughKeyValueStorage");
/**
 * A {@link KeyValueStorage} that prepends a relative path to the key.
 * Leading slashes of the relative path are trimmed, and a trailing slash is added if needed.
 */
class ContainerPathStorage extends PassthroughKeyValueStorage_1.PassthroughKeyValueStorage {
    basePath;
    constructor(source, relativePath) {
        super(source);
        this.basePath = (0, PathUtil_1.trimLeadingSlashes)((0, PathUtil_1.ensureTrailingSlash)(relativePath));
    }
    async *entries() {
        for await (const [key, value] of this.source.entries()) {
            // The only relevant entries for this storage are those that start with the base path
            if (!key.startsWith(this.basePath)) {
                continue;
            }
            yield [this.toOriginalKey(key), value];
        }
    }
    toNewKey(key) {
        return (0, PathUtil_1.joinUrl)(this.basePath, key);
    }
    toOriginalKey(path) {
        return path.slice(this.basePath.length);
    }
}
exports.ContainerPathStorage = ContainerPathStorage;
//# sourceMappingURL=ContainerPathStorage.js.map