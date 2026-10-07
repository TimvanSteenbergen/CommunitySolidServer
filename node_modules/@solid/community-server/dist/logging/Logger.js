"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrappingLogger = exports.BaseLogger = void 0;
const node_cluster_1 = __importDefault(require("node:cluster"));
/**
 * Base class that implements all additional {@link BaseLogger} methods,
 * leaving only the implementation of {@link SimpleLogger}.
 */
class BaseLogger {
    getMeta = () => ({
        pid: process.pid,
        isPrimary: node_cluster_1.default.isPrimary,
    });
    error(message) {
        return this.log('error', message, this.getMeta());
    }
    warn(message) {
        return this.log('warn', message, this.getMeta());
    }
    info(message) {
        return this.log('info', message, this.getMeta());
    }
    verbose(message) {
        return this.log('verbose', message, this.getMeta());
    }
    debug(message) {
        return this.log('debug', message, this.getMeta());
    }
    silly(message) {
        return this.log('silly', message, this.getMeta());
    }
}
exports.BaseLogger = BaseLogger;
/**
 * Implements {@link BaseLogger} around a {@link SimpleLogger},
 * which can be swapped out a runtime.
 */
class WrappingLogger extends BaseLogger {
    logger;
    constructor(logger) {
        super();
        this.logger = logger;
    }
    log(level, message, meta) {
        this.logger.log(level, message, meta);
        return this;
    }
}
exports.WrappingLogger = WrappingLogger;
//# sourceMappingURL=Logger.js.map