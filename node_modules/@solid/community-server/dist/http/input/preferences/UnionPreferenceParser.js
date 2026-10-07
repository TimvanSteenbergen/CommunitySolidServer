"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionPreferenceParser = void 0;
const InternalServerError_1 = require("../../../util/errors/InternalServerError");
const UnionHandler_1 = require("../../../util/handlers/UnionHandler");
/**
 * Combines the results of multiple {@link PreferenceParser}s.
 * Will throw an error if multiple parsers return a range as these can't logically be combined.
 */
class UnionPreferenceParser extends UnionHandler_1.UnionHandler {
    constructor(parsers) {
        super(parsers, false, false);
    }
    async combine(results) {
        const rangeCount = results.filter((result) => Boolean(result.range)).length;
        if (rangeCount > 1) {
            throw new InternalServerError_1.InternalServerError('Found multiple range values. This implies a misconfiguration.');
        }
        const preferences = {};
        for (const result of results) {
            for (const key of Object.keys(result)) {
                if (key === 'range') {
                    preferences[key] = result[key];
                }
                else {
                    preferences[key] = { ...preferences[key], ...result[key] };
                }
            }
        }
        return preferences;
    }
}
exports.UnionPreferenceParser = UnionPreferenceParser;
//# sourceMappingURL=UnionPreferenceParser.js.map