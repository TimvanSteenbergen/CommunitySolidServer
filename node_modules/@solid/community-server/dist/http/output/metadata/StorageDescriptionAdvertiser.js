"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageDescriptionAdvertiser = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const ErrorUtil_1 = require("../../../util/errors/ErrorUtil");
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const PathUtil_1 = require("../../../util/PathUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const MetadataWriter_1 = require("./MetadataWriter");
/**
 * Adds a link header pointing to the relevant storage description resource.
 * Recursively checks parent containers until a storage container is found,
 * and then appends the provided relative path to determine the storage description resource.
 */
class StorageDescriptionAdvertiser extends MetadataWriter_1.MetadataWriter {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    storageStrategy;
    relativePath;
    constructor(storageStrategy, relativePath) {
        super();
        this.storageStrategy = storageStrategy;
        this.relativePath = relativePath;
    }
    async handle({ response, metadata }) {
        // This indicates this is the response of a successful GET/HEAD request
        if (!metadata.has(Vocabularies_1.RDF.terms.type, Vocabularies_1.LDP.terms.Resource)) {
            return;
        }
        const identifier = { path: metadata.identifier.value };
        let storageRoot;
        try {
            storageRoot = await this.storageStrategy.getStorageIdentifier(identifier);
            this.logger.debug(`Found storage root ${storageRoot.path}`);
        }
        catch (error) {
            this.logger.error(`Unable to find storage root: ${(0, ErrorUtil_1.createErrorMessage)(error)}. The storage/location import in the server configuration is probably wrong.`);
            return;
        }
        const storageDescription = (0, PathUtil_1.joinUrl)(storageRoot.path, this.relativePath);
        (0, HeaderUtil_1.addHeader)(response, 'Link', `<${storageDescription}>; rel="${Vocabularies_1.SOLID.storageDescription}"`);
    }
}
exports.StorageDescriptionAdvertiser = StorageDescriptionAdvertiser;
//# sourceMappingURL=StorageDescriptionAdvertiser.js.map