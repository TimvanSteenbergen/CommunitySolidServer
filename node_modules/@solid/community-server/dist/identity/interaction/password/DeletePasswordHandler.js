"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePasswordHandler = void 0;
const AccountUtil_1 = require("../account/util/AccountUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
/**
 * Handles the deletion of a password login method.
 */
class DeletePasswordHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    passwordStore;
    passwordRoute;
    constructor(passwordStore, passwordRoute) {
        super();
        this.passwordStore = passwordStore;
        this.passwordRoute = passwordRoute;
    }
    async handle({ target, accountId }) {
        const match = (0, AccountUtil_1.parsePath)(this.passwordRoute, target.path);
        const login = await this.passwordStore.get(match.passwordId);
        (0, AccountUtil_1.verifyAccountId)(accountId, login?.accountId);
        await this.passwordStore.delete(match.passwordId);
        return { json: {} };
    }
}
exports.DeletePasswordHandler = DeletePasswordHandler;
//# sourceMappingURL=DeletePasswordHandler.js.map