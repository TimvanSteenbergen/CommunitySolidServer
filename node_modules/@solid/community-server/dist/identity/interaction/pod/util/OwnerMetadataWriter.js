"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerMetadataWriter = void 0;
const n3_1 = require("n3");
const MetadataWriter_1 = require("../../../../http/output/metadata/MetadataWriter");
const LogUtil_1 = require("../../../../logging/LogUtil");
const ErrorUtil_1 = require("../../../../util/errors/ErrorUtil");
const HeaderUtil_1 = require("../../../../util/HeaderUtil");
var isBlankNode = n3_1.Util.isBlankNode;
/**
 * Adds link headers indicating who the owners are when accessing the base URL of a pod.
 * Only owners that have decided to be visible will be shown.
 *
 * Solid, §4.1: "When a server wants to advertise the owner of a storage,
 * the server MUST include the Link header with rel="http://www.w3.org/ns/solid/terms#owner"
 * targeting the URI of the owner in the response of HTTP HEAD or GET requests targeting the root container."
 * https://solidproject.org/TR/2022/protocol-20221231#server-storage-link-owner
 */
class OwnerMetadataWriter extends MetadataWriter_1.MetadataWriter {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    podStore;
    storageStrategy;
    constructor(podStore, storageStrategy) {
        super();
        this.podStore = podStore;
        this.storageStrategy = storageStrategy;
    }
    async handle({ metadata, response }) {
        // Doing all checks here instead of in `canHandle` as this is currently used in a ParallelHandler,
        // which doesn't correctly check the canHandle/handle combination.
        if (isBlankNode(metadata.identifier)) {
            // Blank nodes indicate errors
            this.logger.debug('Skipping owner link headers as metadata identifier is a blank node.');
            return;
        }
        const identifier = { path: metadata.identifier.value };
        let storageIdentifier;
        try {
            storageIdentifier = await this.storageStrategy.getStorageIdentifier(identifier);
        }
        catch (error) {
            this.logger
                .debug(`Skipping owner link headers as no storage identifier could be found: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            return;
        }
        // Only need to expose headers when requesting the base URl of the pod
        if (identifier.path !== storageIdentifier.path) {
            return;
        }
        const pod = await this.podStore.findByBaseUrl(identifier.path);
        if (!pod) {
            this.logger.debug(`No pod object found for base URL ${identifier.path}`);
            return;
        }
        const owners = await this.podStore.getOwners(pod.id);
        if (!owners) {
            this.logger.error(`Unable to find owners for pod ${identifier.path}`);
            return;
        }
        for (const { webId, visible } of owners) {
            if (visible) {
                (0, HeaderUtil_1.addHeader)(response, 'Link', `<${webId}>; rel="http://www.w3.org/ns/solid/terms#owner"`);
            }
        }
    }
}
exports.OwnerMetadataWriter = OwnerMetadataWriter;
//# sourceMappingURL=OwnerMetadataWriter.js.map