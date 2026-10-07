"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RdfToQuadConverter = void 0;
const node_stream_1 = require("node:stream");
const context_entries_1 = require("@comunica/context-entries");
const rdf_parse_1 = __importDefault(require("rdf-parse"));
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const RepresentationMetadata_1 = require("../../http/representation/RepresentationMetadata");
const ContentTypes_1 = require("../../util/ContentTypes");
const BadRequestHttpError_1 = require("../../util/errors/BadRequestHttpError");
const StreamUtil_1 = require("../../util/StreamUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const BaseTypedRepresentationConverter_1 = require("./BaseTypedRepresentationConverter");
const ConversionUtil_1 = require("./ConversionUtil");
/**
 * Converts most major RDF serializations to `internal/quads`.
 *
 * Custom contexts can be defined to be used when parsing JSON-LD.
 * The keys of the object should be the URL of the context,
 * and the values the file path of the contexts to use when the JSON-LD parser would fetch the given context.
 * We use filepaths because embedding them directly into the configurations breaks Components.js.
 */
class RdfToQuadConverter extends BaseTypedRepresentationConverter_1.BaseTypedRepresentationConverter {
    documentLoader;
    constructor(contexts = {}) {
        const inputTypes = rdf_parse_1.default.getContentTypesPrioritized()
            // ContentType application/json MAY NOT be converted to Quad.
            .then((types) => {
            delete types[ContentTypes_1.APPLICATION_JSON];
            return types;
        });
        super(inputTypes, ContentTypes_1.INTERNAL_QUADS);
        this.documentLoader = new ConversionUtil_1.ContextDocumentLoader(contexts);
    }
    async handle({ representation, identifier }) {
        const newMetadata = new RepresentationMetadata_1.RepresentationMetadata(representation.metadata, ContentTypes_1.INTERNAL_QUADS);
        const rawQuads = rdf_parse_1.default.parse(representation.data, {
            contentType: representation.metadata.contentType,
            baseIRI: identifier.path,
            [context_entries_1.KeysRdfParseJsonLd.documentLoader.name]: this.documentLoader,
        })
            // This works only for those cases where the data stream has been completely read before accessing the metadata.
            // Eg. the PATCH operation, which is the main case why we store the prefixes in metadata here if there are any.
            // See also https://github.com/CommunitySolidServer/CommunitySolidServer/issues/126
            .on('prefix', (prefix, iri) => {
            newMetadata.addQuad(iri.value, Vocabularies_1.PREFERRED_PREFIX_TERM, prefix, Vocabularies_1.SOLID_META.terms.ResponseMetadata);
        });
        const pass = new node_stream_1.PassThrough({ objectMode: true });
        const data = (0, StreamUtil_1.pipeSafely)(rawQuads, pass, (error) => new BadRequestHttpError_1.BadRequestHttpError(error.message));
        return new BasicRepresentation_1.BasicRepresentation(data, newMetadata);
    }
}
exports.RdfToQuadConverter = RdfToQuadConverter;
//# sourceMappingURL=RdfToQuadConverter.js.map