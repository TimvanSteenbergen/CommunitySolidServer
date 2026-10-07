"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsecureWebIdExtractor = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const NotImplementedHttpError_1 = require("../util/errors/NotImplementedHttpError");
const HeaderUtil_1 = require("../util/HeaderUtil");
const CredentialsExtractor_1 = require("./CredentialsExtractor");
/**
 * Credentials extractor which simply interprets the contents of the Authorization header as a WebID.
 */
class UnsecureWebIdExtractor extends CredentialsExtractor_1.CredentialsExtractor {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    async canHandle({ headers }) {
        const { authorization } = headers;
        if (!(0, HeaderUtil_1.matchesAuthorizationScheme)('WebID', authorization)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('No WebID Authorization header specified.');
        }
    }
    async handle({ headers }) {
        const webId = /^WebID\s+(.*)/iu.exec(headers.authorization)[1];
        this.logger.info(`Agent unsecurely claims to be ${webId}`);
        return { agent: { webId } };
    }
}
exports.UnsecureWebIdExtractor = UnsecureWebIdExtractor;
//# sourceMappingURL=UnsecureWebIdExtractor.js.map