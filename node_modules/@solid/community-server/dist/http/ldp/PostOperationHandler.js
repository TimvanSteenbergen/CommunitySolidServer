"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostOperationHandler = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../util/errors/BadRequestHttpError");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const IterableUtil_1 = require("../../util/IterableUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const CreatedResponseDescription_1 = require("../output/response/CreatedResponseDescription");
const OperationHandler_1 = require("./OperationHandler");
/**
 * Handles POST {@link Operation}s.
 * Calls the addResource function from a {@link ResourceStore}.
 */
class PostOperationHandler extends OperationHandler_1.OperationHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    store;
    constructor(store) {
        super();
        this.store = store;
    }
    async canHandle({ operation }) {
        if (operation.method !== 'POST') {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('This handler only supports POST operations');
        }
    }
    async handle({ operation }) {
        const type = new Set(operation.body.metadata.getAll(Vocabularies_1.RDF.terms.type).map((term) => term.value));
        const isContainerType = type.has(Vocabularies_1.LDP.Container) || type.has(Vocabularies_1.LDP.BasicContainer);
        // Solid, §2.1: "A Solid server MUST reject PUT, POST and PATCH requests
        // without the Content-Type header with a status code of 400."
        // https://solid.github.io/specification/protocol#http-server
        // An exception is made for LDP Containers as nothing is done with the body, so a Content-type is not required
        if (!operation.body.metadata.contentType && !isContainerType) {
            this.logger.warn('POST requests require the Content-Type header to be set');
            throw new BadRequestHttpError_1.BadRequestHttpError('POST requests require the Content-Type header to be set');
        }
        const changes = await this.store.addResource(operation.target, operation.body, operation.conditions);
        const createdIdentifier = (0, IterableUtil_1.find)(changes.keys(), (identifier) => Boolean(changes.get(identifier)?.has(Vocabularies_1.SOLID_AS.terms.activity, Vocabularies_1.AS.terms.Create)));
        if (!createdIdentifier) {
            throw new InternalServerError_1.InternalServerError('Operation was successful but no created identifier was returned.');
        }
        return new CreatedResponseDescription_1.CreatedResponseDescription(createdIdentifier);
    }
}
exports.PostOperationHandler = PostOperationHandler;
//# sourceMappingURL=PostOperationHandler.js.map