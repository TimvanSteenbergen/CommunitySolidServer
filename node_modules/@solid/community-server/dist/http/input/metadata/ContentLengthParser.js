"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentLengthParser = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const MetadataParser_1 = require("./MetadataParser");
/**
 * Parser for the `content-length` header.
 */
class ContentLengthParser extends MetadataParser_1.MetadataParser {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    async handle(input) {
        const contentLength = input.request.headers['content-length'];
        if (contentLength) {
            const length = /^\s*(\d+)\s*(?:;.*)?$/u.exec(contentLength)?.[1];
            if (length) {
                input.metadata.contentLength = Number(length);
            }
            else {
                this.logger.warn(`Invalid content-length header found: ${contentLength}.`);
            }
        }
    }
}
exports.ContentLengthParser = ContentLengthParser;
//# sourceMappingURL=ContentLengthParser.js.map