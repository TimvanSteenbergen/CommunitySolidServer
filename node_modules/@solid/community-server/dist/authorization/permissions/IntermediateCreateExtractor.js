"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntermediateCreateExtractor = void 0;
const ModesExtractor_1 = require("./ModesExtractor");
const Permissions_1 = require("./Permissions");
/**
 * Returns the required access modes from the source {@link ModesExtractor}.
 * In case create permissions are required,
 * verifies if any of the containers permissions also need to be created
 * and adds the corresponding identifier/mode combinations.
 */
class IntermediateCreateExtractor extends ModesExtractor_1.ModesExtractor {
    resourceSet;
    strategy;
    source;
    /**
     * Certain permissions depend on the existence of the target resource.
     * The provided {@link ResourceSet} will be used for that.
     *
     * @param resourceSet - {@link ResourceSet} that can verify the target resource existence.
     * @param strategy - {@link IdentifierStrategy} that will be used to determine parent containers.
     * @param source - The source {@link ModesExtractor}.
     */
    constructor(resourceSet, strategy, source) {
        super();
        this.resourceSet = resourceSet;
        this.strategy = strategy;
        this.source = source;
    }
    async canHandle(input) {
        return this.source.canHandle(input);
    }
    async handle(input) {
        const requestedModes = await this.source.handle(input);
        for (const key of requestedModes.distinctKeys()) {
            if (requestedModes.hasEntry(key, Permissions_1.AccessMode.create)) {
                // Add the `create` mode if the parent does not exist yet
                const parent = this.strategy.getParentContainer(key);
                if (!await this.resourceSet.hasResource(parent)) {
                    // It is not completely clear at this point which permissions need to be available
                    // on intermediate containers to create them,
                    // so we stick with `create` for now.
                    requestedModes.add(parent, Permissions_1.AccessMode.create);
                }
            }
        }
        return requestedModes;
    }
}
exports.IntermediateCreateExtractor = IntermediateCreateExtractor;
//# sourceMappingURL=IntermediateCreateExtractor.js.map