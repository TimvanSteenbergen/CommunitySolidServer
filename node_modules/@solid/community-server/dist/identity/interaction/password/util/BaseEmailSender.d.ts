import { EmailSender } from './EmailSender';
import type { EmailArgs } from './EmailSender';
export interface EmailSenderArgs {
    emailConfig: {
        host: string;
        port: number;
        auth: {
            user: string;
            pass: string;
        };
    };
    senderName?: string;
}
/**
 * Sends e-mails using nodemailer.
 */
export declare class BaseEmailSender extends EmailSender {
    private readonly logger;
    private readonly mailTransporter;
    private readonly senderName;
    constructor(args: EmailSenderArgs);
    handle({ recipient, subject, text, html }: EmailArgs): Promise<void>;
}
