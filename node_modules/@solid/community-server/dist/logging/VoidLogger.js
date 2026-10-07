"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoidLogger = void 0;
const Logger_1 = require("./Logger");
/**
 * A logger that does nothing on a log message.
 */
class VoidLogger extends Logger_1.BaseLogger {
    log() {
        // Do nothing
        return this;
    }
}
exports.VoidLogger = VoidLogger;
//# sourceMappingURL=VoidLogger.js.map