"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassthroughDataAccessor = void 0;
/**
 * DataAccessor that calls the corresponding functions of the source DataAccessor.
 * Can be extended by data accessors that do not want to override all functions
 * by implementing a decorator pattern.
 */
class PassthroughDataAccessor {
    accessor;
    constructor(accessor) {
        this.accessor = accessor;
    }
    async writeDocument(identifier, data, metadata) {
        return this.accessor.writeDocument(identifier, data, metadata);
    }
    async writeContainer(identifier, metadata) {
        return this.accessor.writeContainer(identifier, metadata);
    }
    async canHandle(representation) {
        return this.accessor.canHandle(representation);
    }
    async getData(identifier) {
        return this.accessor.getData(identifier);
    }
    async getMetadata(identifier) {
        return this.accessor.getMetadata(identifier);
    }
    async writeMetadata(identifier, metadata) {
        return this.accessor.writeMetadata(identifier, metadata);
    }
    getChildren(identifier) {
        return this.accessor.getChildren(identifier);
    }
    async deleteResource(identifier) {
        return this.accessor.deleteResource(identifier);
    }
}
exports.PassthroughDataAccessor = PassthroughDataAccessor;
//# sourceMappingURL=PassthroughDataAccessor.js.map