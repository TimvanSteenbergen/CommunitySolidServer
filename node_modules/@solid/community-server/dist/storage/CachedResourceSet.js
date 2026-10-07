"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedResourceSet = void 0;
/**
 * Caches resource existence in a `WeakMap` tied to the `ResourceIdentifier` object.
 */
class CachedResourceSet {
    source;
    cache;
    constructor(source) {
        this.source = source;
        this.cache = new WeakMap();
    }
    async hasResource(identifier) {
        if (this.cache.has(identifier)) {
            return this.cache.get(identifier);
        }
        const result = await this.source.hasResource(identifier);
        this.cache.set(identifier, result);
        return result;
    }
}
exports.CachedResourceSet = CachedResourceSet;
//# sourceMappingURL=CachedResourceSet.js.map