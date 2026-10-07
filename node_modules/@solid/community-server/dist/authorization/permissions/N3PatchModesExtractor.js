"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N3PatchModesExtractor = void 0;
const N3Patch_1 = require("../../http/representation/N3Patch");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const IdentifierMap_1 = require("../../util/map/IdentifierMap");
const ModesExtractor_1 = require("./ModesExtractor");
const Permissions_1 = require("./Permissions");
/**
 * Extracts the required access modes from an N3 Patch.
 *
 * Solid, §5.3.1: "When ?conditions is non-empty, servers MUST treat the request as a Read operation.
 * When ?insertions is non-empty, servers MUST (also) treat the request as an Append operation.
 * When ?deletions is non-empty, servers MUST treat the request as a Read and Write operation."
 * https://solid.github.io/specification/protocol#n3-patch
 */
class N3PatchModesExtractor extends ModesExtractor_1.ModesExtractor {
    resourceSet;
    /**
     * Certain permissions depend on the existence of the target resource.
     * The provided {@link ResourceSet} will be used for that.
     *
     * @param resourceSet - {@link ResourceSet} that can verify the target resource existence.
     */
    constructor(resourceSet) {
        super();
        this.resourceSet = resourceSet;
    }
    async canHandle({ body }) {
        if (!(0, N3Patch_1.isN3Patch)(body)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Can only determine permissions of N3 Patch documents.');
        }
    }
    async handle({ body, target }) {
        const { deletes, inserts, conditions } = body;
        const requiredModes = new IdentifierMap_1.IdentifierSetMultiMap();
        // When ?conditions is non-empty, servers MUST treat the request as a Read operation.
        if (conditions.length > 0) {
            requiredModes.add(target, Permissions_1.AccessMode.read);
        }
        // When ?insertions is non-empty, servers MUST (also) treat the request as an Append operation.
        if (inserts.length > 0) {
            requiredModes.add(target, Permissions_1.AccessMode.append);
            if (!await this.resourceSet.hasResource(target)) {
                requiredModes.add(target, Permissions_1.AccessMode.create);
            }
        }
        // When ?deletions is non-empty, servers MUST treat the request as a Read and Write operation.
        if (deletes.length > 0) {
            requiredModes.add(target, Permissions_1.AccessMode.read);
            requiredModes.add(target, Permissions_1.AccessMode.write);
        }
        return requiredModes;
    }
}
exports.N3PatchModesExtractor = N3PatchModesExtractor;
//# sourceMappingURL=N3PatchModesExtractor.js.map