"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootStorageLocationStrategy = void 0;
/**
 * A {@link StorageLocationStrategy} to be used when the server has one storage in the root container of the server.
 */
class RootStorageLocationStrategy {
    root;
    constructor(baseUrl) {
        this.root = { path: baseUrl };
    }
    async getStorageIdentifier() {
        return this.root;
    }
}
exports.RootStorageLocationStrategy = RootStorageLocationStrategy;
//# sourceMappingURL=RootStorageLocationStrategy.js.map