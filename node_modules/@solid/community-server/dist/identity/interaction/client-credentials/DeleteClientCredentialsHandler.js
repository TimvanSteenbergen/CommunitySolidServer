"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteClientCredentialsHandler = void 0;
const AccountUtil_1 = require("../account/util/AccountUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
/**
 * Handles the deletion of client credentials tokens.
 */
class DeleteClientCredentialsHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
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
        await this.clientCredentialsStore.delete(match.clientCredentialsId);
        return { json: {} };
    }
}
exports.DeleteClientCredentialsHandler = DeleteClientCredentialsHandler;
//# sourceMappingURL=DeleteClientCredentialsHandler.js.map