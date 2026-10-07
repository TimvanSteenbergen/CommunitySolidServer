"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuadToRdfConverter = void 0;
const n3_1 = require("n3");
const rdf_serialize_1 = __importDefault(require("rdf-serialize"));
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const ContentTypes_1 = require("../../util/ContentTypes");
const StreamUtil_1 = require("../../util/StreamUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const BaseTypedRepresentationConverter_1 = require("./BaseTypedRepresentationConverter");
const ConversionUtil_1 = require("./ConversionUtil");
/**
 * Converts `internal/quads` to most major RDF serializations.
 */
class QuadToRdfConverter extends BaseTypedRepresentationConverter_1.BaseTypedRepresentationConverter {
    outputPreferences;
    constructor(options = {}) {
        super(ContentTypes_1.INTERNAL_QUADS, options.outputPreferences ?? rdf_serialize_1.default.getContentTypesPrioritized());
    }
    async handle({ identifier, representation: quads, preferences }) {
        // Can not be undefined if the `canHandle` call passed
        const contentType = (0, ConversionUtil_1.getConversionTarget)(await this.getOutputTypes(ContentTypes_1.INTERNAL_QUADS), preferences.type);
        let data;
        // Remove the ResponseMetadata graph as we never want to see it in a serialization
        // Note that this is a temporary solution as indicated in following comment:
        // https://github.com/CommunitySolidServer/CommunitySolidServer/pull/1188#discussion_r853830903
        quads.data = (0, StreamUtil_1.transformSafely)(quads.data, {
            objectMode: true,
            transform(quad) {
                if (quad.graph.equals(Vocabularies_1.SOLID_META.terms.ResponseMetadata)) {
                    this.push(n3_1.DataFactory.quad(quad.subject, quad.predicate, quad.object));
                }
                else {
                    this.push(quad);
                }
            },
        });
        // Use prefixes if possible (see https://github.com/rubensworks/rdf-serialize.js/issues/1)
        if (/(?:turtle|trig)$/u.test(contentType)) {
            const prefixes = Object.fromEntries(quads.metadata.quads(null, Vocabularies_1.PREFERRED_PREFIX_TERM, null)
                .map(({ subject, object }) => [object.value, subject.value]));
            const options = { format: contentType, baseIRI: identifier.path, prefixes };
            data = (0, StreamUtil_1.pipeSafely)(quads.data, new n3_1.StreamWriter(options));
            // Otherwise, write without prefixes
        }
        else {
            data = rdf_serialize_1.default.serialize(quads.data, { contentType });
        }
        return new BasicRepresentation_1.BasicRepresentation(data, quads.metadata, contentType);
    }
}
exports.QuadToRdfConverter = QuadToRdfConverter;
//# sourceMappingURL=QuadToRdfConverter.js.map