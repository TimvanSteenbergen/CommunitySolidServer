"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeErrorHandler = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const ErrorUtil_1 = require("../../../util/errors/ErrorUtil");
const StreamUtil_1 = require("../../../util/StreamUtil");
const ErrorHandler_1 = require("./ErrorHandler");
/**
 * Returns a simple text description of an error.
 * This class is a failsafe in case the wrapped error handler fails.
 */
class SafeErrorHandler extends ErrorHandler_1.ErrorHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    errorHandler;
    showStackTrace;
    constructor(errorHandler, showStackTrace = false) {
        super();
        this.errorHandler = errorHandler;
        this.showStackTrace = showStackTrace;
    }
    async handle(input) {
        try {
            return await this.errorHandler.handleSafe(input);
        }
        catch (error) {
            this.logger.debug(`Recovering from error handler failure: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
        }
        const { error } = input;
        error.metadata.contentType = 'text/plain';
        const text = typeof error.stack === 'string' && this.showStackTrace ?
            `${error.stack}\n` :
            `${error.name}: ${error.message}\n`;
        return {
            statusCode: error.statusCode,
            metadata: error.metadata,
            data: (0, StreamUtil_1.guardedStreamFrom)(text),
        };
    }
}
exports.SafeErrorHandler = SafeErrorHandler;
//# sourceMappingURL=SafeErrorHandler.js.map