"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuxiliaryLinkMetadataWriter = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const MetadataWriter_1 = require("./MetadataWriter");
/**
 * A {@link MetadataWriter} that takes a specific auxiliaryStrategy and relation type as input and
 * creates a Link header with the strategy identifier and the relation type as "rel" value.
 */
class AuxiliaryLinkMetadataWriter extends MetadataWriter_1.MetadataWriter {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    auxiliaryStrategy;
    specificStrategy;
    relationType;
    /**
     * @param auxiliaryStrategy - The strategy used to check if an identifier is any kind of auxiliary identifier.
     * @param specificStrategy - The strategy used to create a specific kind of auxiliary identifier.
     * @param relationType - The value used to create the "rel" value of the Link header.
     */
    constructor(auxiliaryStrategy, specificStrategy, relationType) {
        super();
        this.auxiliaryStrategy = auxiliaryStrategy;
        this.specificStrategy = specificStrategy;
        this.relationType = relationType;
    }
    async handle(input) {
        let identifier;
        if (input.metadata.has(Vocabularies_1.RDF.terms.type, Vocabularies_1.LDP.terms.Resource)) {
            identifier = { path: input.metadata.identifier.value };
        }
        else {
            const target = input.metadata.get(Vocabularies_1.SOLID_ERROR.terms.target);
            if (target) {
                identifier = { path: target.value };
            }
        }
        // The metadata identifier will be a blank node in case an error was thrown.
        if (identifier && !this.auxiliaryStrategy.isAuxiliaryIdentifier(identifier)) {
            const auxiliaryIdentifier = this.specificStrategy.getAuxiliaryIdentifier(identifier);
            (0, HeaderUtil_1.addHeader)(input.response, 'Link', `<${auxiliaryIdentifier.path}>; rel="${this.relationType}"`);
        }
    }
}
exports.AuxiliaryLinkMetadataWriter = AuxiliaryLinkMetadataWriter;
//# sourceMappingURL=AuxiliaryLinkMetadataWriter.js.map