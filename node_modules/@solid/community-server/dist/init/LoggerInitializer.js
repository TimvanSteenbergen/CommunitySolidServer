"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerInitializer = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const Initializer_1 = require("./Initializer");
/**
 * Sets up the global logger factory.
 */
class LoggerInitializer extends Initializer_1.Initializer {
    loggerFactory;
    constructor(loggerFactory) {
        super();
        this.loggerFactory = loggerFactory;
    }
    async handle() {
        (0, LogUtil_1.setGlobalLoggerFactory)(this.loggerFactory);
    }
}
exports.LoggerInitializer = LoggerInitializer;
//# sourceMappingURL=LoggerInitializer.js.map