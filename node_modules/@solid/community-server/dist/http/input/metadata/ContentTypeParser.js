"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTypeParser = void 0;
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const MetadataParser_1 = require("./MetadataParser");
/**
 * Parser for the `content-type` header.
 */
class ContentTypeParser extends MetadataParser_1.MetadataParser {
    async handle(input) {
        const contentType = input.request.headers['content-type'];
        if (contentType) {
            input.metadata.contentTypeObject = (0, HeaderUtil_1.parseContentType)(contentType);
        }
    }
}
exports.ContentTypeParser = ContentTypeParser;
//# sourceMappingURL=ContentTypeParser.js.map