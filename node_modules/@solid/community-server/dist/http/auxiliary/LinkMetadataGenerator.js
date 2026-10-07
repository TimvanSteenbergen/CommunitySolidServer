"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkMetadataGenerator = void 0;
const n3_1 = require("n3");
const Vocabularies_1 = require("../../util/Vocabularies");
const MetadataGenerator_1 = require("./MetadataGenerator");
/**
 * Adds a link to the auxiliary resource when called on the subject resource.
 * Specifically: <subjectId> <link> <auxiliaryId> will be added.
 *
 * In case the input is metadata of an auxiliary resource no metadata will be added
 */
class LinkMetadataGenerator extends MetadataGenerator_1.MetadataGenerator {
    link;
    identifierStrategy;
    constructor(link, identifierStrategy) {
        super();
        this.link = n3_1.DataFactory.namedNode(link);
        this.identifierStrategy = identifierStrategy;
    }
    async handle(metadata) {
        const identifier = { path: metadata.identifier.value };
        if (!this.identifierStrategy.isAuxiliaryIdentifier(identifier)) {
            metadata.add(this.link, n3_1.DataFactory.namedNode(this.identifierStrategy.getAuxiliaryIdentifier(identifier).path), Vocabularies_1.SOLID_META.terms.ResponseMetadata);
        }
    }
}
exports.LinkMetadataGenerator = LinkMetadataGenerator;
//# sourceMappingURL=LinkMetadataGenerator.js.map