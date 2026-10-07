"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerPermissionReader = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const IterableUtil_1 = require("../util/IterableUtil");
const IdentifierMap_1 = require("../util/map/IdentifierMap");
const PermissionReader_1 = require("./PermissionReader");
/**
 * Allows control access if the request is being made by an owner of the pod containing the resource.
 */
class OwnerPermissionReader extends PermissionReader_1.PermissionReader {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    podStore;
    authStrategy;
    storageStrategy;
    constructor(podStore, authStrategy, storageStrategy) {
        super();
        this.podStore = podStore;
        this.authStrategy = authStrategy;
        this.storageStrategy = storageStrategy;
    }
    async handle(input) {
        const result = new IdentifierMap_1.IdentifierMap();
        const requestedResources = input.requestedModes.distinctKeys();
        const auths = [...(0, IterableUtil_1.filter)(requestedResources, (id) => this.authStrategy.isAuxiliaryIdentifier(id))];
        if (auths.length === 0) {
            this.logger.debug(`No authorization resources found that need an ownership check.`);
            return result;
        }
        const webId = input.credentials.agent?.webId;
        if (!webId) {
            this.logger.debug(`No WebId found for an ownership check on the pod.`);
            return result;
        }
        const pods = await this.findPods(auths);
        const owners = await this.findOwners(Object.values(pods));
        for (const auth of auths) {
            const webIds = owners[pods[auth.path]];
            if (!webIds) {
                continue;
            }
            if (webIds.includes(webId)) {
                this.logger.debug(`Granting Control permissions to owner on ${auth.path}`);
                result.set(auth, {
                    read: true,
                    write: true,
                    append: true,
                    create: true,
                    delete: true,
                    control: true,
                });
            }
        }
        return result;
    }
    /**
     * Finds all pods that contain the given identifiers.
     * Return value is a record where the keys are the identifiers and the values the associated pod.
     */
    async findPods(identifiers) {
        const pods = {};
        for (const identifier of identifiers) {
            let pod;
            try {
                pod = await this.storageStrategy.getStorageIdentifier(identifier);
            }
            catch {
                this.logger.error(`Unable to find root storage for ${identifier.path}`);
                continue;
            }
            pods[identifier.path] = pod.path;
        }
        return pods;
    }
    /**
     * Finds the owners of the given pods.
     * Return value is a record where the keys are the pods and the values are all the WebIDs that own this pod.
     */
    async findOwners(pods) {
        const owners = {};
        // Set to only have the unique values
        for (const baseUrl of new Set(pods)) {
            const pod = await this.podStore.findByBaseUrl(baseUrl);
            if (!pod) {
                this.logger.error(`Unable to find pod ${baseUrl}`);
                continue;
            }
            const podOwners = await this.podStore.getOwners(pod.id);
            if (!podOwners) {
                this.logger.error(`Unable to find owners for ${baseUrl}`);
                continue;
            }
            owners[baseUrl] = podOwners.map((owner) => owner.webId);
        }
        return owners;
    }
}
exports.OwnerPermissionReader = OwnerPermissionReader;
//# sourceMappingURL=OwnerPermissionReader.js.map