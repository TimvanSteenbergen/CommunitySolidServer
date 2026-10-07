import type { Logger as WinstonInnerLogger } from 'winston';
import { BaseLogger } from './Logger';
import type { LogLevel } from './LogLevel';
/**
 * A WinstonLogger implements the {@link Logger} interface using a given winston logger.
 */
export declare class WinstonLogger extends BaseLogger {
    private readonly logger;
    constructor(logger: WinstonInnerLogger);
    log(level: LogLevel, message: string, meta?: unknown): this;
}
