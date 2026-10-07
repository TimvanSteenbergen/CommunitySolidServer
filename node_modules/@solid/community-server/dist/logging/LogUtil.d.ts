import { LazyLoggerFactory } from './LazyLoggerFactory';
import type { Logger } from './Logger';
import type { LoggerFactory } from './LoggerFactory';
/**
 * Gets a logger instance for the given class instance.
 *
 * The following shows a typical pattern on how to create loggers:
 * ```
 * class MyClass {
 *   protected readonly logger = getLoggerFor(this);
 * }
 * ```
 * If no class is applicable, a logger can also be created as follows:
 * ```
 * const logger = getLoggerFor('MyFunction');
 * ```
 *
 * @param loggable - A class instance or a class string name.
 */
export declare function getLoggerFor(loggable: string | Instance): Logger;
/**
 * Sets the global logger factory.
 * This causes loggers created by {@link getLoggerFor} to delegate to a logger from the given factory.
 *
 * @param loggerFactory - A logger factory.
 */
export declare function setGlobalLoggerFactory(loggerFactory: LoggerFactory): void;
/**
 * Resets the internal logger factory, which holds the global logger factory.
 * For testing purposes only.
 */
export declare function resetInternalLoggerFactory(factory?: LazyLoggerFactory): void;
/**
 * Any class constructor.
 */
interface Constructor {
    name: string;
}
/**
 * Any class instance.
 */
interface Instance {
    constructor: Constructor;
}
export {};
