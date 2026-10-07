"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePasswordHandler = void 0;
const yup_1 = require("yup");
const LogUtil_1 = require("../../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../../util/errors/BadRequestHttpError");
const AccountUtil_1 = require("../account/util/AccountUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
const YupUtil_1 = require("../YupUtil");
const inSchema = (0, yup_1.object)({
    oldPassword: (0, yup_1.string)().trim().min(1).required(),
    newPassword: (0, yup_1.string)().trim().min(1).required(),
});
/**
 * Allows the password of a login to be updated.
 */
class UpdatePasswordHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    passwordStore;
    passwordRoute;
    constructor(passwordStore, passwordRoute) {
        super();
        this.passwordStore = passwordStore;
        this.passwordRoute = passwordRoute;
    }
    async getView() {
        return { json: (0, YupUtil_1.parseSchema)(inSchema) };
    }
    async handle(input) {
        const { target, accountId, json } = input;
        const { oldPassword, newPassword } = await (0, YupUtil_1.validateWithError)(inSchema, json);
        const match = (0, AccountUtil_1.parsePath)(this.passwordRoute, target.path);
        const login = await this.passwordStore.get(match.passwordId);
        (0, AccountUtil_1.verifyAccountId)(accountId, login?.accountId);
        // Make sure the old password is correct
        try {
            await this.passwordStore.authenticate(login.email, oldPassword);
        }
        catch {
            this.logger.warn(`Invalid password when trying to reset for email ${login.email}`);
            throw new BadRequestHttpError_1.BadRequestHttpError('Old password is invalid.');
        }
        await this.passwordStore.update(match.passwordId, newPassword);
        return { json: {} };
    }
}
exports.UpdatePasswordHandler = UpdatePasswordHandler;
//# sourceMappingURL=UpdatePasswordHandler.js.map