"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkRelMetadataWriter = void 0;
const n3_1 = require("n3");
const LogUtil_1 = require("../../../logging/LogUtil");
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const MetadataWriter_1 = require("./MetadataWriter");
/**
 * A {@link MetadataWriter} that takes a linking metadata predicates to Link header "rel" values.
 * The values of the objects will be put in a Link header with the corresponding "rel" value.
 */
class LinkRelMetadataWriter extends MetadataWriter_1.MetadataWriter {
    linkRelMap;
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor(linkRelMap) {
        super();
        this.linkRelMap = new Map();
        for (const [key, value] of Object.entries(linkRelMap)) {
            this.linkRelMap.set(n3_1.DataFactory.namedNode(key), value);
        }
    }
    async handle(input) {
        this.logger.debug(`Available link relations: ${this.linkRelMap.size}`);
        for (const [predicate, relValue] of this.linkRelMap) {
            const values = input.metadata.getAll(predicate)
                .map((term) => `<${term.value}>; rel="${relValue}"`);
            if (values.length > 0) {
                this.logger.debug(`Adding Link header ${values.join(',')}`);
                (0, HeaderUtil_1.addHeader)(input.response, 'Link', values);
            }
        }
    }
}
exports.LinkRelMetadataWriter = LinkRelMetadataWriter;
//# sourceMappingURL=LinkRelMetadataWriter.js.map