"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcpReader = void 0;
const node_stream_1 = require("node:stream");
const access_control_policy_1 = require("@solid/access-control-policy");
const LogUtil_1 = require("../logging/LogUtil");
const ContentTypes_1 = require("../util/ContentTypes");
const ErrorUtil_1 = require("../util/errors/ErrorUtil");
const InternalServerError_1 = require("../util/errors/InternalServerError");
const NotFoundHttpError_1 = require("../util/errors/NotFoundHttpError");
const IdentifierMap_1 = require("../util/map/IdentifierMap");
const MapUtil_1 = require("../util/map/MapUtil");
const StreamUtil_1 = require("../util/StreamUtil");
const Vocabularies_1 = require("../util/Vocabularies");
const AcpUtil_1 = require("./AcpUtil");
const PermissionReader_1 = require("./PermissionReader");
const AclPermissionSet_1 = require("./permissions/AclPermissionSet");
const Permissions_1 = require("./permissions/Permissions");
const modesMap = {
    [Vocabularies_1.ACL.Read]: [Permissions_1.AccessMode.read],
    [Vocabularies_1.ACL.Write]: [Permissions_1.AccessMode.append, Permissions_1.AccessMode.write],
    [Vocabularies_1.ACL.Append]: [Permissions_1.AccessMode.append],
    [Vocabularies_1.ACL.Control]: [AclPermissionSet_1.AclMode.control],
};
/**
 * Finds the permissions of a resource as defined in the corresponding ACRs.
 * Implementation based on https://solid.github.io/authorization-panel/acp-specification/.
 *
 * Caches data so no duplicate calls are made to the {@link ResourceStore} for a single request.
 */
class AcpReader extends PermissionReader_1.PermissionReader {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    acrStrategy;
    acrStore;
    identifierStrategy;
    constructor(acrStrategy, acrStore, identifierStrategy) {
        super();
        this.acrStrategy = acrStrategy;
        this.acrStore = acrStore;
        this.identifierStrategy = identifierStrategy;
    }
    async handle({ credentials, requestedModes }) {
        this.logger.debug(`Retrieving permissions of ${JSON.stringify(credentials)}`);
        const resourceCache = new IdentifierMap_1.IdentifierMap();
        const permissionMap = new IdentifierMap_1.IdentifierMap();
        // Resolves the targets sequentially so the `resourceCache` can be filled and reused
        for (const target of requestedModes.distinctKeys()) {
            permissionMap.set(target, await this.extractPermissions(target, credentials, resourceCache));
        }
        return permissionMap;
    }
    /**
     * Generates the allowed permissions.
     *
     * @param target - Target to generate permissions for.
     * @param credentials - Credentials that are trying to access the resource.
     * @param resourceCache - Cache used to store ACR data.
     */
    async extractPermissions(target, credentials, resourceCache) {
        const context = this.createContext(target, credentials);
        const policies = [];
        // Extract all the policies relevant for the target
        const identifiers = this.getAncestorIdentifiers(target);
        for (const identifier of identifiers) {
            const acrs = await (0, MapUtil_1.getDefault)(resourceCache, identifier, async () => [...(0, AcpUtil_1.getAccessControlledResources)(await this.readAcrData(identifier))]);
            const size = policies.length;
            policies.push(...this.getEffectivePolicies(target, acrs));
            this.logger.debug(`Found ${policies.length - size} policies relevant for ${target.path} in ${identifier.path}`);
        }
        const modes = (0, access_control_policy_1.allowAccessModes)(policies, context);
        const permissionSet = {};
        for (const aclMode of modes) {
            if (aclMode in modesMap) {
                for (const mode of modesMap[aclMode]) {
                    permissionSet[mode] = true;
                }
            }
        }
        return permissionSet;
    }
    /**
     * Creates an ACP context targeting the given identifier with the provided credentials.
     */
    createContext(target, credentials) {
        return {
            target: target.path,
            agent: credentials.agent?.webId,
            client: credentials.client?.clientId,
            issuer: credentials.issuer?.url,
        };
    }
    /**
     * Returns all {@link IPolicy} found in `resources` that apply to the target identifier.
     * https://solidproject.org/TR/2022/acp-20220518#effective-policies
     */
    *getEffectivePolicies(target, resources) {
        for (const { iri, accessControlResource } of resources) {
            // Use the `accessControl` entries if the `target` corresponds to the `iri` used in the ACR.
            // If not, this means this is an ACR of a parent resource, and we need to use the `memberAccessControl` field.
            const accessControlField = iri === target.path ? 'accessControl' : 'memberAccessControl';
            yield* accessControlResource[accessControlField].flatMap((ac) => ac.policy);
        }
    }
    /**
     * Returns the given identifier and all its ancestors.
     * These are all the identifiers that are relevant for determining the effective policies.
     */
    *getAncestorIdentifiers(identifier) {
        yield identifier;
        while (!this.identifierStrategy.isRootContainer(identifier)) {
            identifier = this.identifierStrategy.getParentContainer(identifier);
            yield identifier;
        }
    }
    /**
     * Returns the data found in the ACR corresponding to the given identifier.
     */
    async readAcrData(identifier) {
        const acrIdentifier = this.acrStrategy.getAuxiliaryIdentifier(identifier);
        let data;
        try {
            this.logger.debug(`Reading ACR document ${acrIdentifier.path}`);
            ({ data } = await this.acrStore.getRepresentation(acrIdentifier, { type: { [ContentTypes_1.INTERNAL_QUADS]: 1 } }));
        }
        catch (error) {
            if (!NotFoundHttpError_1.NotFoundHttpError.isInstance(error)) {
                const message = `Error reading ACR ${acrIdentifier.path}: ${(0, ErrorUtil_1.createErrorMessage)(error)}`;
                this.logger.error(message);
                throw new InternalServerError_1.InternalServerError(message, { cause: error });
            }
            this.logger.debug(`No direct ACR document found for ${identifier.path}`);
            data = node_stream_1.Readable.from([]);
        }
        return (0, StreamUtil_1.readableToQuads)(data);
    }
}
exports.AcpReader = AcpReader;
//# sourceMappingURL=AcpReader.js.map