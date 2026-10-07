"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateModesExtractor = void 0;
const ModesExtractor_1 = require("./ModesExtractor");
const Permissions_1 = require("./Permissions");
/**
 * Adds the `create` access mode to the result of the source in case the target resource does not exist.
 */
class CreateModesExtractor extends ModesExtractor_1.ModesExtractor {
    source;
    resourceSet;
    constructor(source, resourceSet) {
        super();
        this.source = source;
        this.resourceSet = resourceSet;
    }
    async canHandle(operation) {
        await this.source.canHandle(operation);
    }
    async handle(operation) {
        const accessMap = await this.source.handle(operation);
        if (!accessMap.hasEntry(operation.target, Permissions_1.AccessMode.create) &&
            !await this.resourceSet.hasResource(operation.target)) {
            accessMap.add(operation.target, Permissions_1.AccessMode.create);
        }
        return accessMap;
    }
}
exports.CreateModesExtractor = CreateModesExtractor;
//# sourceMappingURL=CreateModesExtractor.js.map