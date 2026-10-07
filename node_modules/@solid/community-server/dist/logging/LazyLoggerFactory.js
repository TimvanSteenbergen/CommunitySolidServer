"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyLoggerFactory = void 0;
const node_cluster_1 = __importDefault(require("node:cluster"));
const Logger_1 = require("./Logger");
/**
 * Temporary {@link LoggerFactory} that buffers log messages in memory
 * until the {@link TemporaryLoggerFactory#switch} method is called.
 */
class TemporaryLoggerFactory {
    bufferSpaces;
    wrappers = [];
    buffer = [];
    constructor(bufferSize = 1024) {
        this.bufferSpaces = bufferSize;
    }
    createLogger(label) {
        const wrapper = new Logger_1.WrappingLogger({
            log: (level, message) => this.bufferLogEntry(wrapper, level, message),
        });
        this.wrappers.push({ wrapper, label });
        return wrapper;
    }
    bufferLogEntry(logger, level, message) {
        // Buffer the message if spaces are still available
        if (this.bufferSpaces > 0) {
            this.bufferSpaces -= 1;
            // If this is the last space, instead generate a warning through a new logger
            if (this.bufferSpaces === 0) {
                logger = this.createLogger('LazyLoggerFactory');
                level = 'warn';
                message = `Memory-buffered logging limit of ${this.buffer.length + 1} reached`;
            }
            this.buffer.push({ logger, level, message });
        }
        return logger;
    }
    /**
     * Swaps all lazy loggers to new loggers from the given factory,
     * and emits any buffered messages through those actual loggers.
     */
    switch(loggerFactory) {
        // Instantiate an actual logger within every lazy logger
        for (const { wrapper, label } of this.wrappers.splice(0, this.wrappers.length)) {
            wrapper.logger = loggerFactory.createLogger(label);
        }
        // Emit all buffered log messages
        for (const { logger, level, message } of this.buffer.splice(0, this.buffer.length)) {
            logger.log(level, message, { isPrimary: node_cluster_1.default.isPrimary, pid: process.pid });
        }
    }
}
/**
 * Wraps around another {@link LoggerFactory} that can be set lazily.
 * This is useful when objects are instantiated (and when they create loggers)
 * before the logging system has been fully instantiated,
 * as is the case when using a dependency injection framework such as Components.js.
 *
 * Loggers can be created even before a {@link LoggerFactory} is set;
 * any log messages will be buffered and re-emitted.
 */
class LazyLoggerFactory {
    factory;
    constructor(options = {}) {
        this.factory = new TemporaryLoggerFactory(options.bufferSize);
    }
    get loggerFactory() {
        if (this.factory instanceof TemporaryLoggerFactory) {
            throw new TypeError('Logger factory not yet set.');
        }
        return this.factory;
    }
    set loggerFactory(loggerFactory) {
        if (this.factory instanceof TemporaryLoggerFactory) {
            this.factory.switch(loggerFactory);
        }
        this.factory = loggerFactory;
    }
    createLogger(label) {
        return this.factory.createLogger(label);
    }
}
exports.LazyLoggerFactory = LazyLoggerFactory;
//# sourceMappingURL=LazyLoggerFactory.js.map