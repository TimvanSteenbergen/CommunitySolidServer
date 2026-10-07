"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RdfPatcher = void 0;
const n3_1 = require("n3");
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const RepresentationMetadata_1 = require("../../http/representation/RepresentationMetadata");
const LogUtil_1 = require("../../logging/LogUtil");
const ContentTypes_1 = require("../../util/ContentTypes");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const StreamUtil_1 = require("../../util/StreamUtil");
const RepresentationPatcher_1 = require("./RepresentationPatcher");
/**
 * Patcher that converts the representation data to a representation with an N3 store, does the patch using this store
 * and then converts the representation with store back to a representation with data which gets returned
 */
class RdfPatcher extends RepresentationPatcher_1.RepresentationPatcher {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    patcher;
    constructor(patcher) {
        super();
        this.patcher = patcher;
    }
    async canHandle({ identifier, patch, representation }) {
        let newRepresentation;
        if (representation) {
            newRepresentation = { ...representation, dataset: new n3_1.Store() };
        }
        await this.patcher.canHandle({ identifier, patch, representation: newRepresentation });
    }
    async handle({ identifier, patch, representation }) {
        let metadata = new RepresentationMetadata_1.RepresentationMetadata(identifier, ContentTypes_1.INTERNAL_QUADS);
        if (representation && representation.metadata.contentType !== ContentTypes_1.INTERNAL_QUADS) {
            this.logger.error('Received non-quad data. This should not happen so there is probably a configuration error.');
            throw new InternalServerError_1.InternalServerError('Quad stream was expected for patching.');
        }
        // Drain representation data to N3 Store
        const inputRepresentation = representation ?
            representation :
            new BasicRepresentation_1.BasicRepresentation();
        if (representation) {
            inputRepresentation.dataset = await (0, StreamUtil_1.readableToQuads)(representation.data);
            ({ metadata } = representation);
        }
        else {
            inputRepresentation.dataset = new n3_1.Store();
        }
        // Execute the patcher
        const patchedRepresentation = await this.patcher.handle({
            identifier,
            patch,
            representation: inputRepresentation,
        });
        // Return the n3 store to the representation
        // This casting is necessary due to N3.js typings not being precise enough
        const data = patchedRepresentation.dataset.match();
        return new BasicRepresentation_1.BasicRepresentation(data, metadata, false);
    }
}
exports.RdfPatcher = RdfPatcher;
//# sourceMappingURL=RdfPatcher.js.map