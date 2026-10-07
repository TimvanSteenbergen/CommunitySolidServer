"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionCredentialsExtractor = void 0;
const UnionHandler_1 = require("../util/handlers/UnionHandler");
/**
 * Combines the results of several CredentialsExtractors into one.
 * If multiple of these extractors return a value for the same key,
 * the last result will be used.
 */
class UnionCredentialsExtractor extends UnionHandler_1.UnionHandler {
    constructor(extractors) {
        super(extractors);
    }
    async combine(results) {
        // Combine all the results into a single object
        const credentials = {};
        for (const result of results) {
            for (const key of Object.keys(result)) {
                this.setValue(credentials, key, result[key]);
            }
        }
        return credentials;
    }
    /**
     * Helper function that makes sure the typings are correct.
     */
    setValue(credentials, key, value) {
        if (value) {
            credentials[key] = value;
        }
    }
}
exports.UnionCredentialsExtractor = UnionCredentialsExtractor;
//# sourceMappingURL=UnionCredentialsExtractor.js.map