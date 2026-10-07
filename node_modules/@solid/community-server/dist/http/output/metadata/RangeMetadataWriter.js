"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeMetadataWriter = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const QuadUtil_1 = require("../../../util/QuadUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const MetadataWriter_1 = require("./MetadataWriter");
/**
 * Generates the necessary `content-range` header if there is range metadata.
 * If the start or end is unknown, a `*` will be used instead.
 * According to the RFC, this is incorrect,
 * but is all we can do as long as we don't know the full length of the representation in advance.
 * For the same reason, the total length of the representation will always be `*`.
 *
 * This class also adds the content-length header.
 * This will contain either the full size for standard requests,
 * or the size of the slice for range requests.
 */
class RangeMetadataWriter extends MetadataWriter_1.MetadataWriter {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    async handle(input) {
        const size = (0, QuadUtil_1.termToInt)(input.metadata.get(Vocabularies_1.POSIX.terms.size));
        const unit = input.metadata.get(Vocabularies_1.SOLID_HTTP.terms.unit)?.value;
        if (!unit) {
            if (typeof size === 'number') {
                (0, HeaderUtil_1.addHeader)(input.response, 'Content-Length', `${size}`);
            }
            return;
        }
        let start = (0, QuadUtil_1.termToInt)(input.metadata.get(Vocabularies_1.SOLID_HTTP.terms.start));
        if (typeof start === 'number' && start < 0 && typeof size === 'number') {
            start = size + start;
        }
        let end = (0, QuadUtil_1.termToInt)(input.metadata.get(Vocabularies_1.SOLID_HTTP.terms.end));
        if (typeof end !== 'number' && typeof size === 'number') {
            end = size - 1;
        }
        const rangeHeader = `${unit} ${start ?? '*'}-${end ?? '*'}/${size ?? '*'}`;
        (0, HeaderUtil_1.addHeader)(input.response, 'Content-Range', rangeHeader);
        if (typeof start === 'number' && typeof end === 'number') {
            (0, HeaderUtil_1.addHeader)(input.response, 'Content-Length', `${end - start + 1}`);
        }
        else {
            this.logger.warn(`Generating invalid content-range header due to missing size information: ${rangeHeader}`);
        }
    }
}
exports.RangeMetadataWriter = RangeMetadataWriter;
//# sourceMappingURL=RangeMetadataWriter.js.map