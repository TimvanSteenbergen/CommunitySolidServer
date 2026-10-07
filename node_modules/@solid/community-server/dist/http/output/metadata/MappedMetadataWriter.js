"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappedMetadataWriter = void 0;
const n3_1 = require("n3");
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const MetadataWriter_1 = require("./MetadataWriter");
/**
 * A {@link MetadataWriter} that takes a map directly converting metadata predicates to headers.
 * The header value(s) will be the same as the corresponding object value(s).
 */
class MappedMetadataWriter extends MetadataWriter_1.MetadataWriter {
    headerMap;
    constructor(headerMap) {
        super();
        this.headerMap = new Map();
        for (const [key, value] of Object.entries(headerMap)) {
            this.headerMap.set(n3_1.DataFactory.namedNode(key), value);
        }
    }
    async handle(input) {
        for (const [predicate, header] of this.headerMap) {
            const terms = input.metadata.getAll(predicate);
            if (terms.length > 0) {
                (0, HeaderUtil_1.addHeader)(input.response, header, terms.map((term) => term.value));
            }
        }
    }
}
exports.MappedMetadataWriter = MappedMetadataWriter;
//# sourceMappingURL=MappedMetadataWriter.js.map