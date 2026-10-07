"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTypeMetadataWriter = void 0;
const MetadataWriter_1 = require("./MetadataWriter");
/**
 * Adds the `Content-Type` header containing value and parameters (if available).
 */
class ContentTypeMetadataWriter extends MetadataWriter_1.MetadataWriter {
    async handle(input) {
        const { contentTypeObject } = input.metadata;
        if (contentTypeObject) {
            input.response.setHeader('Content-Type', contentTypeObject.toHeaderValueString());
        }
    }
}
exports.ContentTypeMetadataWriter = ContentTypeMetadataWriter;
//# sourceMappingURL=ContentTypeMetadataWriter.js.map