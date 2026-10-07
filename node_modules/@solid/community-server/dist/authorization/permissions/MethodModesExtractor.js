"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodModesExtractor = void 0;
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const IdentifierMap_1 = require("../../util/map/IdentifierMap");
const PathUtil_1 = require("../../util/PathUtil");
const ModesExtractor_1 = require("./ModesExtractor");
const Permissions_1 = require("./Permissions");
const READ_METHODS = new Set(['OPTIONS', 'GET', 'HEAD']);
const SUPPORTED_METHODS = new Set([...READ_METHODS, 'PUT', 'POST', 'DELETE']);
/**
 * Generates permissions for the base set of methods that always require the same permissions.
 * Specifically: GET, HEAD, POST, PUT and DELETE.
 */
class MethodModesExtractor extends ModesExtractor_1.ModesExtractor {
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
    async canHandle({ method }) {
        if (!SUPPORTED_METHODS.has(method)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Cannot determine permissions of ${method}`);
        }
    }
    async handle({ method, target }) {
        const requiredModes = new IdentifierMap_1.IdentifierSetMultiMap();
        // Reading requires Read permissions on the resource
        if (READ_METHODS.has(method)) {
            requiredModes.add(target, Permissions_1.AccessMode.read);
        }
        if (method === 'PUT') {
            if (await this.resourceSet.hasResource(target)) {
                // Replacing a resource's representation with PUT requires Write permissions
                requiredModes.add(target, Permissions_1.AccessMode.write);
            }
            else {
                // ... while creating a new resource with PUT requires Append and Create permissions.
                requiredModes.add(target, Permissions_1.AccessMode.append);
                requiredModes.add(target, Permissions_1.AccessMode.create);
            }
        }
        // Creating a new resource in a container requires Append access to that container
        if (method === 'POST') {
            requiredModes.add(target, Permissions_1.AccessMode.append);
        }
        // Deleting a resource requires Delete access
        if (method === 'DELETE') {
            requiredModes.add(target, Permissions_1.AccessMode.delete);
            // …and, if the target is a container, Read permissions are required as well
            // as this exposes if a container is empty or not
            if ((0, PathUtil_1.isContainerIdentifier)(target)) {
                requiredModes.add(target, Permissions_1.AccessMode.read);
            }
        }
        return requiredModes;
    }
}
exports.MethodModesExtractor = MethodModesExtractor;
//# sourceMappingURL=MethodModesExtractor.js.map