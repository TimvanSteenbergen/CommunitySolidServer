"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCredentialsDetailsHandler = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const AccountUtil_1 = require("../account/util/AccountUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
/**
 * Provides a view on a client credentials token, indicating the token identifier and its associated WebID.
 */
class ClientCredentialsDetailsHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    clientCredentialsStore;
    clientCredentialsRoute;
    constructor(clientCredentialsStore, clientCredentialsRoute) {
        super();
        this.clientCredentialsStore = clientCredentialsStore;
        this.clientCredentialsRoute = clientCredentialsRoute;
    }
    async handle({ target, accountId }) {
        const match = (0, AccountUtil_1.parsePath)(this.clientCredentialsRoute, target.path);
        const credentials = await this.clientCredentialsStore.get(match.clientCredentialsId);
        (0, AccountUtil_1.verifyAccountId)(accountId, credentials?.accountId);
        return { json: {
                id: credentials.label,
                webId: credentials.webId,
            } };
    }
}
exports.ClientCredentialsDetailsHandler = ClientCredentialsDetailsHandler;
//# sourceMappingURL=ClientCredentialsDetailsHandler.js.map