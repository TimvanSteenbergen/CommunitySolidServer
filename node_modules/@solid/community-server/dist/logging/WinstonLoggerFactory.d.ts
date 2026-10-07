import type * as Transport from 'winston-transport';
import type { Logger } from './Logger';
import type { LoggerFactory } from './LoggerFactory';
/**
 * Uses the winston library to create loggers for the given logging level.
 * By default, it will print to the console with colorized logging levels.
 *
 * This creates instances of {@link WinstonLogger}.
 */
export declare class WinstonLoggerFactory implements LoggerFactory {
    private readonly level;
    constructor(level: string);
    private readonly clusterInfo;
    createLogger(label: string): Logger;
    protected createTransports(): Transport[];
}
