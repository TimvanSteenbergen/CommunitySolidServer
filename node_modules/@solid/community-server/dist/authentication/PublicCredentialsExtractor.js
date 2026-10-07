"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicCredentialsExtractor = void 0;
const CredentialsExtractor_1 = require("./CredentialsExtractor");
/**
 * Extracts the "public credentials", to be used for data everyone has access to.
 * This class mainly exists so a {@link Credentials} is still generated in case the token parsing fails.
 */
class PublicCredentialsExtractor extends CredentialsExtractor_1.CredentialsExtractor {
    async handle() {
        return {};
    }
}
exports.PublicCredentialsExtractor = PublicCredentialsExtractor;
//# sourceMappingURL=PublicCredentialsExtractor.js.map