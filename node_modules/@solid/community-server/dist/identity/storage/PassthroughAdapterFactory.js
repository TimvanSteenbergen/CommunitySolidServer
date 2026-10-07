"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassthroughAdapterFactory = exports.PassthroughAdapter = void 0;
/**
 * OIDC Adapter that calls the corresponding functions of the source Adapter.
 * Can be extended by adapters that do not want to override all functions
 * by implementing a decorator pattern.
 */
class PassthroughAdapter {
    name;
    source;
    constructor(name, source) {
        this.name = name;
        this.source = source;
    }
    async upsert(id, payload, expiresIn) {
        return this.source.upsert(id, payload, expiresIn);
    }
    async find(id) {
        return this.source.find(id);
    }
    async findByUserCode(userCode) {
        return this.source.findByUserCode(userCode);
    }
    async findByUid(uid) {
        return this.source.findByUid(uid);
    }
    async consume(id) {
        return this.source.consume(id);
    }
    async destroy(id) {
        return this.source.destroy(id);
    }
    async revokeByGrantId(grantId) {
        return this.source.revokeByGrantId(grantId);
    }
}
exports.PassthroughAdapter = PassthroughAdapter;
class PassthroughAdapterFactory {
    source;
    constructor(source) {
        this.source = source;
    }
    createStorageAdapter(name) {
        return this.source.createStorageAdapter(name);
    }
}
exports.PassthroughAdapterFactory = PassthroughAdapterFactory;
//# sourceMappingURL=PassthroughAdapterFactory.js.map