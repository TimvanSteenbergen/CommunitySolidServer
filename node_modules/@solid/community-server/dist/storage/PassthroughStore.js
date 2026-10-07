"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassthroughStore = void 0;
/**
 * Store that calls the corresponding functions of the source Store.
 * Can be extended by stores that do not want to override all functions
 * by implementing a decorator pattern.
 */
class PassthroughStore {
    source;
    constructor(source) {
        this.source = source;
    }
    async hasResource(identifier) {
        return this.source.hasResource(identifier);
    }
    async getRepresentation(identifier, preferences, conditions) {
        return this.source.getRepresentation(identifier, preferences, conditions);
    }
    async addResource(container, representation, conditions) {
        return this.source.addResource(container, representation, conditions);
    }
    async deleteResource(identifier, conditions) {
        return this.source.deleteResource(identifier, conditions);
    }
    async modifyResource(identifier, patch, conditions) {
        return this.source.modifyResource(identifier, patch, conditions);
    }
    async setRepresentation(identifier, representation, conditions) {
        return this.source.setRepresentation(identifier, representation, conditions);
    }
}
exports.PassthroughStore = PassthroughStore;
//# sourceMappingURL=PassthroughStore.js.map