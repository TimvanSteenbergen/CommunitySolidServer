import { BaseLogger } from './Logger';
/**
 * A logger that does nothing on a log message.
 */
export declare class VoidLogger extends BaseLogger {
    log(): this;
}
