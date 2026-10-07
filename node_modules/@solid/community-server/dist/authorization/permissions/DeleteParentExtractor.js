"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteParentExtractor = void 0;
const ModesExtractor_1 = require("./ModesExtractor");
const Permissions_1 = require("./Permissions");
/**
 * In case a resource is being deleted but does not exist,
 * the server response code depends on the access modes the agent has on the parent container.
 * In case the agent has read access on the parent container, a 404 should be returned,
 * otherwise it should be 401/403.
 *
 * This class adds support for this by requiring read access on the parent container
 * in case the target resource does not exist.
 */
class DeleteParentExtractor extends ModesExtractor_1.ModesExtractor {
    source;
    resourceSet;
    identifierStrategy;
    constructor(source, resourceSet, identifierStrategy) {
        super();
        this.source = source;
        this.resourceSet = resourceSet;
        this.identifierStrategy = identifierStrategy;
    }
    async canHandle(operation) {
        await this.source.canHandle(operation);
    }
    async handle(operation) {
        const accessMap = await this.source.handle(operation);
        const { target } = operation;
        if (accessMap.get(target)?.has(Permissions_1.AccessMode.delete) &&
            !this.identifierStrategy.isRootContainer(target) &&
            !await this.resourceSet.hasResource(target)) {
            const parent = this.identifierStrategy.getParentContainer(target);
            accessMap.add(parent, new Set([Permissions_1.AccessMode.read]));
        }
        return accessMap;
    }
}
exports.DeleteParentExtractor = DeleteParentExtractor;
//# sourceMappingURL=DeleteParentExtractor.js.map