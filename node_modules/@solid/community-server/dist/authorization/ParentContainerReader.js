"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentContainerReader = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const IdentifierMap_1 = require("../util/map/IdentifierMap");
const MapUtil_1 = require("../util/map/MapUtil");
const PermissionReader_1 = require("./PermissionReader");
const Permissions_1 = require("./permissions/Permissions");
/**
 * Determines `delete` and `create` permissions for those resources that need it
 * by making sure the parent container has the required permissions.
 *
 * Create requires `append` permissions on the parent container.
 * Delete requires `write` permissions on both the parent container and the resource itself.
 */
class ParentContainerReader extends PermissionReader_1.PermissionReader {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    reader;
    identifierStrategy;
    constructor(reader, identifierStrategy) {
        super();
        this.reader = reader;
        this.identifierStrategy = identifierStrategy;
    }
    async handle({ requestedModes, credentials }) {
        // Finds the entries for which we require parent container permissions
        const containerMap = this.findParents(requestedModes);
        // Merges the necessary parent container modes with the already requested modes
        const combinedModes = (0, MapUtil_1.modify)(new IdentifierMap_1.IdentifierSetMultiMap(requestedModes), { add: containerMap.values() });
        const result = await this.reader.handleSafe({ requestedModes: combinedModes, credentials });
        // Updates the create/delete permissions based on the parent container permissions
        for (const [identifier, [container]] of containerMap) {
            this.logger.debug(`Determining ${identifier.path} create and delete permissions based on ${container.path}`);
            result.set(identifier, this.addContainerPermissions(result.get(identifier), result.get(container)));
        }
        return result;
    }
    /**
     * Finds the identifiers for which we need parent permissions.
     * Values are the parent identifier and the permissions they need.
     */
    findParents(requestedModes) {
        const containerMap = new IdentifierMap_1.IdentifierMap();
        for (const [identifier, modes] of requestedModes.entrySets()) {
            if (modes.has(Permissions_1.AccessMode.create) || modes.has(Permissions_1.AccessMode.delete)) {
                const container = this.identifierStrategy.getParentContainer(identifier);
                containerMap.set(identifier, [container, this.getParentModes(modes)]);
            }
        }
        return containerMap;
    }
    /**
     * Determines which permissions are required on the parent container.
     */
    getParentModes(modes) {
        const containerModes = new Set();
        if (modes.has(Permissions_1.AccessMode.create)) {
            containerModes.add(Permissions_1.AccessMode.append);
        }
        if (modes.has(Permissions_1.AccessMode.delete)) {
            containerModes.add(Permissions_1.AccessMode.write);
        }
        return containerModes;
    }
    /**
     * Merges the container permission set into the resource permission set
     * based on the parent container rules for create/delete permissions.
     */
    addContainerPermissions(resourceSet, containerSet) {
        resourceSet = resourceSet ?? {};
        containerSet = containerSet ?? {};
        return this.interpretContainerPermission(resourceSet, containerSet);
    }
    /**
     * Determines the create and delete permissions for the given resource permissions
     * based on those of its parent container.
     */
    interpretContainerPermission(resourcePermission, containerPermission) {
        const mergedPermission = { ...resourcePermission };
        // https://solidproject.org/TR/2021/wac-20210711:
        // When an operation requests to create a resource as a member of a container resource,
        // the server MUST match an Authorization allowing the acl:Append or acl:Write access privilege
        // on the container for new members.
        mergedPermission.create = containerPermission.append && resourcePermission.create !== false;
        // https://solidproject.org/TR/2021/wac-20210711:
        // When an operation requests to delete a resource,
        // the server MUST match Authorizations allowing the acl:Write access privilege
        // on the resource and the containing container.
        mergedPermission.delete =
            resourcePermission.write &&
                containerPermission.write &&
                resourcePermission.delete !== false;
        return mergedPermission;
    }
}
exports.ParentContainerReader = ParentContainerReader;
//# sourceMappingURL=ParentContainerReader.js.map