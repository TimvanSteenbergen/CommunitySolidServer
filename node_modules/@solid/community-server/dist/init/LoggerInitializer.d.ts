import type { LoggerFactory } from '../logging/LoggerFactory';
import { Initializer } from './Initializer';
/**
 * Sets up the global logger factory.
 */
export declare class LoggerInitializer extends Initializer {
    private readonly loggerFactory;
    constructor(loggerFactory: LoggerFactory);
    handle(): Promise<void>;
}
