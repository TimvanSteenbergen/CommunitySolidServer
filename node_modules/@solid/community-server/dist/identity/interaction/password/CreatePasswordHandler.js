"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePasswordHandler = void 0;
const yup_1 = require("yup");
const LogUtil_1 = require("../../../logging/LogUtil");
const AccountUtil_1 = require("../account/util/AccountUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
const YupUtil_1 = require("../YupUtil");
const inSchema = (0, yup_1.object)({
    email: (0, yup_1.string)().trim().email().required(),
    password: (0, yup_1.string)().trim().min(1).required(),
});
/**
 * Handles the creation of email/password login combinations for an account.
 */
class CreatePasswordHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    passwordStore;
    passwordRoute;
    constructor(passwordStore, passwordRoute) {
        super();
        this.passwordStore = passwordStore;
        this.passwordRoute = passwordRoute;
    }
    async getView({ accountId }) {
        (0, AccountUtil_1.assertAccountId)(accountId);
        const passwordLogins = {};
        for (const { id, email } of await this.passwordStore.findByAccount(accountId)) {
            passwordLogins[email] = this.passwordRoute.getPath({ accountId, passwordId: id });
        }
        return { json: { ...(0, YupUtil_1.parseSchema)(inSchema), passwordLogins } };
    }
    async handle({ accountId, json }) {
        // Email will be in lowercase
        const { email, password } = await (0, YupUtil_1.validateWithError)(inSchema, json);
        (0, AccountUtil_1.assertAccountId)(accountId);
        const passwordId = await this.passwordStore.create(email, accountId, password);
        const resource = this.passwordRoute.getPath({ accountId, passwordId });
        // If we ever want to add email verification this would have to be checked separately
        await this.passwordStore.confirmVerification(passwordId);
        return { json: { resource } };
    }
}
exports.CreatePasswordHandler = CreatePasswordHandler;
//# sourceMappingURL=CreatePasswordHandler.js.map