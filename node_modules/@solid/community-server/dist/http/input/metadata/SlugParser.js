"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlugParser = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../../util/errors/BadRequestHttpError");
const Vocabularies_1 = require("../../../util/Vocabularies");
const MetadataParser_1 = require("./MetadataParser");
/**
 * Converts the contents of the slug header to metadata.
 */
class SlugParser extends MetadataParser_1.MetadataParser {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    async handle(input) {
        const { slug } = input.request.headers;
        if (slug) {
            if (Array.isArray(slug)) {
                this.logger.warn(`Expected 0 or 1 Slug headers but received ${slug.length}`);
                throw new BadRequestHttpError_1.BadRequestHttpError('Request has multiple Slug headers');
            }
            this.logger.debug(`Request Slug is '${slug}'.`);
            input.metadata.set(Vocabularies_1.SOLID_HTTP.terms.slug, slug);
        }
    }
}
exports.SlugParser = SlugParser;
//# sourceMappingURL=SlugParser.js.map