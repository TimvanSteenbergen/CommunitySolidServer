"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangePreferenceParser = void 0;
const BadRequestHttpError_1 = require("../../../util/errors/BadRequestHttpError");
const PreferenceParser_1 = require("./PreferenceParser");
/**
 * Parses the range header into range preferences.
 * If the range corresponds to a suffix-length range, it will be stored in `start` as a negative value.
 */
class RangePreferenceParser extends PreferenceParser_1.PreferenceParser {
    async handle({ request: { headers: { range } } }) {
        if (!range) {
            return {};
        }
        const [unit, rangeTail] = range.split('=').map((entry) => entry.trim());
        if (unit.length === 0) {
            throw new BadRequestHttpError_1.BadRequestHttpError(`Missing unit value from range header ${range}`);
        }
        if (!rangeTail) {
            throw new BadRequestHttpError_1.BadRequestHttpError(`Invalid range header format ${range}`);
        }
        const ranges = rangeTail.split(',').map((entry) => entry.trim());
        const parts = [];
        for (const rangeEntry of ranges) {
            const [start, end] = rangeEntry.split('-').map((entry) => entry.trim());
            // This can actually be undefined if the split results in less than 2 elements
            if (typeof end !== 'string') {
                throw new BadRequestHttpError_1.BadRequestHttpError(`Invalid range header format ${range}`);
            }
            if (start.length === 0) {
                if (end.length === 0) {
                    throw new BadRequestHttpError_1.BadRequestHttpError(`Invalid range header format ${range}`);
                }
                parts.push({ start: -Number.parseInt(end, 10) });
            }
            else {
                const part = { start: Number.parseInt(start, 10) };
                if (end.length > 0) {
                    part.end = Number.parseInt(end, 10);
                }
                parts.push(part);
            }
        }
        return { range: { unit, parts } };
    }
}
exports.RangePreferenceParser = RangePreferenceParser;
//# sourceMappingURL=RangePreferenceParser.js.map