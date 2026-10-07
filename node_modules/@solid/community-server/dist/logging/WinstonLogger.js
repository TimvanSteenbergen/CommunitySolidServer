"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonLogger = void 0;
const Logger_1 = require("./Logger");
/**
 * A WinstonLogger implements the {@link Logger} interface using a given winston logger.
 */
class WinstonLogger extends Logger_1.BaseLogger {
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
exports.WinstonLogger = WinstonLogger;
//# sourceMappingURL=WinstonLogger.js.map