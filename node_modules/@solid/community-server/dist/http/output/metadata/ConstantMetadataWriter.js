"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstantMetadataWriter = void 0;
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const MetadataWriter_1 = require("./MetadataWriter");
/**
 * A {@link MetadataWriter} that takes a constant map of header names and values.
 */
class ConstantMetadataWriter extends MetadataWriter_1.MetadataWriter {
    headers;
    constructor(headers) {
        super();
        this.headers = Object.entries(headers);
    }
    async handle({ response }) {
        for (const [key, value] of this.headers) {
            (0, HeaderUtil_1.addHeader)(response, key, value);
        }
    }
}
exports.ConstantMetadataWriter = ConstantMetadataWriter;
//# sourceMappingURL=ConstantMetadataWriter.js.map