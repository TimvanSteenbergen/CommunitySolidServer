"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodStorageLocationStrategy = void 0;
/**
 * A {@link StorageLocationStrategy} to be used when the server has pods which each are a different storage.
 * The {@link IdentifierGenerator} that is used to generate URLs for the pods
 * is used here to determine what the root pod URL is.
 */
class PodStorageLocationStrategy {
    generator;
    constructor(generator) {
        this.generator = generator;
    }
    async getStorageIdentifier(identifier) {
        return this.generator.extractPod(identifier);
    }
}
exports.PodStorageLocationStrategy = PodStorageLocationStrategy;
//# sourceMappingURL=PodStorageLocationStrategy.js.map