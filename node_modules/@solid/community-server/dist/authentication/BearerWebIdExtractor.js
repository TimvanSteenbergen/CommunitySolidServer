"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearerWebIdExtractor = void 0;
const access_token_verifier_1 = require("@solid/access-token-verifier");
const LogUtil_1 = require("../logging/LogUtil");
const BadRequestHttpError_1 = require("../util/errors/BadRequestHttpError");
const NotImplementedHttpError_1 = require("../util/errors/NotImplementedHttpError");
const HeaderUtil_1 = require("../util/HeaderUtil");
const CredentialsExtractor_1 = require("./CredentialsExtractor");
class BearerWebIdExtractor extends CredentialsExtractor_1.CredentialsExtractor {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    verify;
    constructor() {
        super();
        this.verify = (0, access_token_verifier_1.createSolidTokenVerifier)();
    }
    async canHandle({ headers }) {
        const { authorization } = headers;
        if (!(0, HeaderUtil_1.matchesAuthorizationScheme)('Bearer', authorization)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('No Bearer Authorization header specified.');
        }
    }
    async handle(request) {
        const { headers: { authorization } } = request;
        try {
            const { webid: webId, client_id: clientId, iss: issuer } = await this.verify(authorization);
            this.logger.info(`Verified credentials via Bearer access token. WebID: ${webId}, client ID: ${clientId}, issuer: ${issuer}`);
            const credentials = { agent: { webId }, issuer: { url: issuer } };
            if (clientId) {
                credentials.client = { clientId };
            }
            return credentials;
        }
        catch (error) {
            const message = `Error verifying WebID via Bearer access token: ${error.message}`;
            this.logger.warn(message);
            throw new BadRequestHttpError_1.BadRequestHttpError(message, { cause: error });
        }
    }
}
exports.BearerWebIdExtractor = BearerWebIdExtractor;
//# sourceMappingURL=BearerWebIdExtractor.js.map