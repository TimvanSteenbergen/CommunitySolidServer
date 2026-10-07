"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlainJsonLdFilter = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const NotImplementedHttpError_1 = require("../../../util/errors/NotImplementedHttpError");
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const MetadataParser_1 = require("./MetadataParser");
/**
 * Filter that errors on JSON-LD with a plain application/json content-type.
 * This will not store metadata, only throw errors if necessary.
 */
class PlainJsonLdFilter extends MetadataParser_1.MetadataParser {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor() {
        super();
    }
    async handle(input) {
        const contentTypeHeader = input.request.headers['content-type'];
        if (!contentTypeHeader) {
            return;
        }
        const { value: contentType } = (0, HeaderUtil_1.parseContentType)(contentTypeHeader);
        // Throw error on content-type application/json AND a link header that refers to a JSON-LD context.
        if (contentType === 'application/json' &&
            this.linkHasContextRelation(input.request.headers.link)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('JSON-LD is only supported with the application/ld+json content type.');
        }
    }
    linkHasContextRelation(link = []) {
        return (0, HeaderUtil_1.parseLinkHeader)(link).some(({ parameters }) => parameters.rel === Vocabularies_1.JSON_LD.context);
    }
}
exports.PlainJsonLdFilter = PlainJsonLdFilter;
//# sourceMappingURL=PlainJsonLdFilter.js.map