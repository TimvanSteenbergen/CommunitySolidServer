"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordHandler = void 0;
const yup_1 = require("yup");
const LogUtil_1 = require("../../../logging/LogUtil");
const ErrorUtil_1 = require("../../../util/errors/ErrorUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
const YupUtil_1 = require("../YupUtil");
const inSchema = (0, yup_1.object)({
    email: (0, yup_1.string)().trim().email().required(),
});
/**
 * Responsible for the case where a user forgot their password and asks for a reset.
 * Will send out the necessary mail if the email address is known.
 * The JSON response will always be the same to prevent leaking which email addresses are stored.
 */
class ForgotPasswordHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    passwordStore;
    forgotPasswordStore;
    templateEngine;
    emailSender;
    resetRoute;
    constructor(args) {
        super();
        this.passwordStore = args.passwordStore;
        this.forgotPasswordStore = args.forgotPasswordStore;
        this.templateEngine = args.templateEngine;
        this.emailSender = args.emailSender;
        this.resetRoute = args.resetRoute;
    }
    async getView() {
        return { json: (0, YupUtil_1.parseSchema)(inSchema) };
    }
    /**
     * Generates a record to reset the password for the given email address and then mails it.
     * In case there is no account, no error wil be thrown for privacy reasons.
     * Nothing will happen instead.
     */
    async handle({ json }) {
        const { email } = await (0, YupUtil_1.validateWithError)(inSchema, json);
        const payload = await this.passwordStore.findByEmail(email);
        if (payload?.id) {
            try {
                const recordId = await this.forgotPasswordStore.generate(payload.id);
                await this.sendResetMail(recordId, email);
            }
            catch (error) {
                // This error can not be thrown for privacy reasons.
                // If there always is an error, because there is a problem with the mail server for example,
                // errors would only be thrown for registered accounts.
                // Although we do also leak this information when an account tries to register an email address,
                // so this might be removed in the future.
                this.logger.error(`Problem sending a recovery mail: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            }
        }
        else {
            // Don't emit an error for privacy reasons
            this.logger.warn(`Password reset request for unknown email ${email}`);
        }
        return { json: { email } };
    }
    /**
     * Generates the link necessary for resetting the password and mails it to the given email address.
     */
    async sendResetMail(recordId, email) {
        this.logger.info(`Sending password reset to ${email}`);
        const resetLink = `${this.resetRoute.getPath()}?rid=${encodeURIComponent(recordId)}`;
        const renderedEmail = await this.templateEngine.handleSafe({ contents: { resetLink } });
        await this.emailSender.handleSafe({
            recipient: email,
            subject: 'Reset your password',
            text: `To reset your password, go to this link: ${resetLink}`,
            html: renderedEmail,
        });
    }
}
exports.ForgotPasswordHandler = ForgotPasswordHandler;
//# sourceMappingURL=ForgotPasswordHandler.js.map