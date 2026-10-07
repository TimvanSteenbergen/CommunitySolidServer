"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorToQuadConverter = void 0;
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const RepresentationMetadata_1 = require("../../http/representation/RepresentationMetadata");
const ContentTypes_1 = require("../../util/ContentTypes");
const StreamUtil_1 = require("../../util/StreamUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const BaseTypedRepresentationConverter_1 = require("./BaseTypedRepresentationConverter");
/**
 * Converts an error object into quads by creating a triple for each of name/message/stack.
 */
class ErrorToQuadConverter extends BaseTypedRepresentationConverter_1.BaseTypedRepresentationConverter {
    constructor() {
        super(ContentTypes_1.INTERNAL_ERROR, ContentTypes_1.INTERNAL_QUADS);
    }
    async handle({ identifier, representation }) {
        const error = await (0, StreamUtil_1.getSingleItem)(representation.data);
        // A metadata object makes it easier to add triples due to the utility functions
        const data = new RepresentationMetadata_1.RepresentationMetadata(identifier);
        data.add(Vocabularies_1.DC.terms.title, error.name);
        data.add(Vocabularies_1.DC.terms.description, error.message);
        if (error.stack) {
            data.add(Vocabularies_1.SOLID_ERROR.terms.stack, error.stack);
        }
        // Add all the error terms from the metadata
        data.addQuads(representation.metadata.quads()
            .filter((quad) => quad.predicate.value.startsWith(Vocabularies_1.SOLID_ERROR_TERM.namespace)));
        // Update the content-type to quads
        return new BasicRepresentation_1.BasicRepresentation(data.quads(), representation.metadata, ContentTypes_1.INTERNAL_QUADS, false);
    }
}
exports.ErrorToQuadConverter = ErrorToQuadConverter;
//# sourceMappingURL=ErrorToQuadConverter.js.map