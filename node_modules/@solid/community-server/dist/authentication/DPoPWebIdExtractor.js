"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DPoPWebIdExtractor = void 0;
const access_token_verifier_1 = require("@solid/access-token-verifier");
const LogUtil_1 = require("../logging/LogUtil");
const BadRequestHttpError_1 = require("../util/errors/BadRequestHttpError");
const NotImplementedHttpError_1 = require("../util/errors/NotImplementedHttpError");
const HeaderUtil_1 = require("../util/HeaderUtil");
const CredentialsExtractor_1 = require("./CredentialsExtractor");
/**
 * Credentials extractor that extracts a WebID from a DPoP-bound access token.
 */
class DPoPWebIdExtractor extends CredentialsExtractor_1.CredentialsExtractor {
    originalUrlExtractor;
    verify = (0, access_token_verifier_1.createSolidTokenVerifier)();
    logger = (0, LogUtil_1.getLoggerFor)(this);
    /**
     * @param originalUrlExtractor - Reconstructs the original URL as requested by the client
     */
    constructor(originalUrlExtractor) {
        super();
        this.originalUrlExtractor = originalUrlExtractor;
    }
    async canHandle({ headers }) {
        const { authorization } = headers;
        if (!(0, HeaderUtil_1.matchesAuthorizationScheme)('DPoP', authorization)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('No DPoP-bound Authorization header specified.');
        }
    }
    async handle(request) {
        const { headers: { authorization, dpop }, method } = request;
        if (!dpop) {
            throw new BadRequestHttpError_1.BadRequestHttpError('No DPoP header specified.');
        }
        // Reconstruct the original URL as requested by the client,
        // since this is the one it used to authorize the request
        const originalUrl = await this.originalUrlExtractor.handleSafe({ request });
        // Validate the Authorization and DPoP header headers
        // and extract the WebID provided by the client
        try {
            const { webid: webId, client_id: clientId, iss: issuer } = await this.verify(authorization, {
                header: dpop,
                method: method,
                url: originalUrl.path,
            });
            this.logger.info(`Verified WebID via DPoP-bound access token. WebID: ${webId}, client ID: ${clientId}, issuer: ${issuer}`);
            const credentials = { agent: { webId }, issuer: { url: issuer } };
            if (clientId) {
                credentials.client = { clientId };
            }
            return credentials;
        }
        catch (error) {
            const message = `Error verifying WebID via DPoP-bound access token: ${error.message}`;
            this.logger.warn(message);
            throw new BadRequestHttpError_1.BadRequestHttpError(message, { cause: error });
        }
    }
}
exports.DPoPWebIdExtractor = DPoPWebIdExtractor;
//# sourceMappingURL=DPoPWebIdExtractor.js.map