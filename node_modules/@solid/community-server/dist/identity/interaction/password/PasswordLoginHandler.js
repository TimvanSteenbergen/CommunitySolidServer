"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordLoginHandler = void 0;
const yup_1 = require("yup");
const LogUtil_1 = require("../../../logging/LogUtil");
const ResolveLoginHandler_1 = require("../login/ResolveLoginHandler");
const YupUtil_1 = require("../YupUtil");
const inSchema = (0, yup_1.object)({
    email: (0, yup_1.string)().trim().email().required(),
    password: (0, yup_1.string)().trim().required(),
    remember: (0, yup_1.boolean)().default(false),
});
/**
 * Handles the submission of the Login Form and logs the user in.
 */
class PasswordLoginHandler extends ResolveLoginHandler_1.ResolveLoginHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    passwordStore;
    constructor(args) {
        super(args.accountStore, args.cookieStore);
        this.passwordStore = args.passwordStore;
    }
    async getView() {
        return { json: (0, YupUtil_1.parseSchema)(inSchema) };
    }
    async login({ json }) {
        const { email, password, remember } = await (0, YupUtil_1.validateWithError)(inSchema, json);
        // Try to log in, will error if email/password combination is invalid
        const { accountId } = await this.passwordStore.authenticate(email, password);
        this.logger.debug(`Logging in user ${email}`);
        return { json: { accountId, remember } };
    }
}
exports.PasswordLoginHandler = PasswordLoginHandler;
//# sourceMappingURL=PasswordLoginHandler.js.map