"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEmailSender = void 0;
const nodemailer_1 = require("nodemailer");
const LogUtil_1 = require("../../../../logging/LogUtil");
const EmailSender_1 = require("./EmailSender");
/**
 * Sends e-mails using nodemailer.
 */
class BaseEmailSender extends EmailSender_1.EmailSender {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    mailTransporter;
    senderName;
    constructor(args) {
        super();
        this.mailTransporter = (0, nodemailer_1.createTransport)(args.emailConfig);
        this.senderName = args.senderName ?? 'Solid';
    }
    async handle({ recipient, subject, text, html }) {
        await this.mailTransporter.sendMail({
            from: this.senderName,
            to: recipient,
            subject,
            text,
            html,
        });
        this.logger.debug(`Sending recovery mail to ${recipient}`);
    }
}
exports.BaseEmailSender = BaseEmailSender;
//# sourceMappingURL=BaseEmailSender.js.map