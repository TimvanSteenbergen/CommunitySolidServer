"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetExtractorErrorHandler = void 0;
const n3_1 = require("n3");
const LogUtil_1 = require("../../../logging/LogUtil");
const ErrorUtil_1 = require("../../../util/errors/ErrorUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const ErrorHandler_1 = require("./ErrorHandler");
/**
 * Adds metadata to an error to indicate the identifier of the originally targeted resource.
 */
class TargetExtractorErrorHandler extends ErrorHandler_1.ErrorHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    errorHandler;
    targetExtractor;
    constructor(errorHandler, targetExtractor) {
        super();
        this.errorHandler = errorHandler;
        this.targetExtractor = targetExtractor;
    }
    async canHandle(input) {
        return this.errorHandler.canHandle(input);
    }
    async handle(input) {
        try {
            const target = await this.targetExtractor.handleSafe(input);
            input.error.metadata.add(Vocabularies_1.SOLID_ERROR.terms.target, n3_1.DataFactory.namedNode(target.path));
        }
        catch (error) {
            this.logger.warn(`Unable to add identifier to error metadata: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
        }
        return this.errorHandler.handle(input);
    }
}
exports.TargetExtractorErrorHandler = TargetExtractorErrorHandler;
//# sourceMappingURL=TargetExtractorErrorHandler.js.map