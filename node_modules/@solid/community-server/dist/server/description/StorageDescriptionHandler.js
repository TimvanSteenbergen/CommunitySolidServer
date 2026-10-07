"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageDescriptionHandler = void 0;
const OkResponseDescription_1 = require("../../http/output/response/OkResponseDescription");
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const ContentTypes_1 = require("../../util/ContentTypes");
const MethodNotAllowedHttpError_1 = require("../../util/errors/MethodNotAllowedHttpError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const OperationHttpHandler_1 = require("../OperationHttpHandler");
/**
 * Generates the response for GET requests targeting a storage description resource.
 * The input path needs to match the relative path used to generate storage description resources
 * and will be used to verify if the container it is linked to is an actual storage.
 */
class StorageDescriptionHandler extends OperationHttpHandler_1.OperationHttpHandler {
    store;
    path;
    describer;
    constructor(store, path, describer) {
        super();
        this.store = store;
        this.path = path;
        this.describer = describer;
    }
    async canHandle({ operation: { target, method } }) {
        if (method !== 'GET') {
            throw new MethodNotAllowedHttpError_1.MethodNotAllowedHttpError([method], `Only GET requests can target the storage description.`);
        }
        const container = this.getStorageIdentifier(target);
        const representation = await this.store.getRepresentation(container, {});
        representation.data.destroy();
        if (!representation.metadata.has(Vocabularies_1.RDF.terms.type, Vocabularies_1.PIM.terms.Storage)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Only supports descriptions of storage containers.`);
        }
        await this.describer.canHandle(target);
    }
    async handle({ operation: { target } }) {
        const quads = await this.describer.handle(this.getStorageIdentifier(target));
        const representation = new BasicRepresentation_1.BasicRepresentation(quads, ContentTypes_1.INTERNAL_QUADS);
        return new OkResponseDescription_1.OkResponseDescription(representation.metadata, representation.data);
    }
    /**
     * Determine the identifier of the root storage based on the identifier of the root storage description resource.
     */
    getStorageIdentifier(descriptionIdentifier) {
        return { path: (0, PathUtil_1.ensureTrailingSlash)(descriptionIdentifier.path.slice(0, -this.path.length)) };
    }
}
exports.StorageDescriptionHandler = StorageDescriptionHandler;
//# sourceMappingURL=StorageDescriptionHandler.js.map