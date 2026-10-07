"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnlinkWebIdHandler = void 0;
const AccountUtil_1 = require("../account/util/AccountUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
/**
 * Allows users to remove WebIDs linked to their account.
 */
class UnlinkWebIdHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    webIdStore;
    webIdRoute;
    constructor(webIdStore, webIdRoute) {
        super();
        this.webIdStore = webIdStore;
        this.webIdRoute = webIdRoute;
    }
    async handle({ target, accountId }) {
        const match = (0, AccountUtil_1.parsePath)(this.webIdRoute, target.path);
        const link = await this.webIdStore.get(match.webIdLink);
        (0, AccountUtil_1.verifyAccountId)(accountId, link?.accountId);
        await this.webIdStore.delete(match.webIdLink);
        return { json: {} };
    }
}
exports.UnlinkWebIdHandler = UnlinkWebIdHandler;
//# sourceMappingURL=UnlinkWebIdHandler.js.map