import type { LogLevel } from './LogLevel';
export interface LogMetadata {
    /** Is the current process the Primary process */
    isPrimary: boolean;
    /** The process id of the current process */
    pid: number;
}
/**
 * Logs messages on a specific level.
 *
 * @see getLoggerFor on how to instantiate loggers.
 */
export interface SimpleLogger {
    /**
     * Log the given message at the given level.
     * If the internal level is higher than the given level, the message may be voided.
     *
     * @param level - The level to log at.
     * @param message - The message to log.
     * @param meta - Optional metadata to include in the log message.
     */
    log: (level: LogLevel, message: string, meta?: LogMetadata) => SimpleLogger;
}
/**
 * Logs messages, with convenience methods to log on a specific level.
 *
 * @see getLoggerFor on how to instantiate loggers.
 */
export interface Logger extends SimpleLogger {
    /**
     * Log the given message at the given level.
     * If the internal level is higher than the given level, the message may be voided.
     *
     * @param level - The level to log at.
     * @param message - The message to log.
     * @param meta - Optional metadata to include in the log message.
     */
    log: (level: LogLevel, message: string, meta?: LogMetadata) => Logger;
    /**
     * Log a message at the 'error' level.
     *
     * @param message - The message to log.
     * @param meta - Optional metadata to include in the log message.
     */
    error: (message: string) => Logger;
    /**
     * Log a message at the 'warn' level.
     *
     * @param message - The message to log.
     * @param meta - Optional metadata to include in the log message.
     */
    warn: (message: string) => Logger;
    /**
     * Log a message at the 'info' level.
     *
     * @param message - The message to log.
     * @param meta - Optional metadata to include in the log message.
     */
    info: (message: string) => Logger;
    /**
     * Log a message at the 'verbose' level.
     *
     * @param message - The message to log.
     * @param meta - Optional metadata to include in the log message.
     */
    verbose: (message: string) => Logger;
    /**
     * Log a message at the 'debug' level.
     *
     * @param message - The message to log.
     * @param meta - Optional metadata to include in the log message.
     */
    debug: (message: string) => Logger;
    /**
     * Log a message at the 'silly' level.
     *
     * @param message - The message to log.
     * @param meta - Optional metadata to include in the log message.
     */
    silly: (message: string) => Logger;
}
/**
 * Base class that implements all additional {@link BaseLogger} methods,
 * leaving only the implementation of {@link SimpleLogger}.
 */
export declare abstract class BaseLogger implements Logger {
    abstract log(level: LogLevel, message: string, meta?: LogMetadata): Logger;
    private readonly getMeta;
    error(message: string): Logger;
    warn(message: string): Logger;
    info(message: string): Logger;
    verbose(message: string): Logger;
    debug(message: string): Logger;
    silly(message: string): Logger;
}
/**
 * Implements {@link BaseLogger} around a {@link SimpleLogger},
 * which can be swapped out a runtime.
 */
export declare class WrappingLogger extends BaseLogger {
    logger: SimpleLogger;
    constructor(logger: SimpleLogger);
    log(level: LogLevel, message: string, meta?: LogMetadata): this;
}
