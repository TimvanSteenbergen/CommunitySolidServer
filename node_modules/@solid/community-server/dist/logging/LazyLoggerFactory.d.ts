import type { Logger } from './Logger';
import type { LoggerFactory } from './LoggerFactory';
/**
 * Wraps around another {@link LoggerFactory} that can be set lazily.
 * This is useful when objects are instantiated (and when they create loggers)
 * before the logging system has been fully instantiated,
 * as is the case when using a dependency injection framework such as Components.js.
 *
 * Loggers can be created even before a {@link LoggerFactory} is set;
 * any log messages will be buffered and re-emitted.
 */
export declare class LazyLoggerFactory implements LoggerFactory {
    private factory;
    constructor(options?: {
        bufferSize?: number;
    });
    get loggerFactory(): LoggerFactory;
    set loggerFactory(loggerFactory: LoggerFactory);
    createLogger(label: string): Logger;
}
