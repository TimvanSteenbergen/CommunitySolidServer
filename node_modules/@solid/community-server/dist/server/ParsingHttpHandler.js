"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsingHttpHandler = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const ErrorUtil_1 = require("../util/errors/ErrorUtil");
const HttpError_1 = require("../util/errors/HttpError");
const InternalServerError_1 = require("../util/errors/InternalServerError");
const HttpHandler_1 = require("./HttpHandler");
/**
 * Parses requests and sends the resulting {@link Operation} to the wrapped {@link OperationHttpHandler}.
 * Errors are caught and handled by the {@link ErrorHandler}.
 * In case the {@link OperationHttpHandler} returns a result it will be sent to the {@link ResponseWriter}.
 */
class ParsingHttpHandler extends HttpHandler_1.HttpHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    requestParser;
    errorHandler;
    responseWriter;
    operationHandler;
    constructor(args) {
        super();
        this.requestParser = args.requestParser;
        this.errorHandler = args.errorHandler;
        this.responseWriter = args.responseWriter;
        this.operationHandler = args.operationHandler;
    }
    async handle({ request, response }) {
        let result;
        try {
            result = await this.handleRequest(request, response);
        }
        catch (error) {
            result = await this.handleError(error, request);
        }
        if (result) {
            await this.responseWriter.handleSafe({ response, result });
        }
    }
    /**
     * Interprets the request and passes the generated Operation object to the stored OperationHttpHandler.
     */
    async handleRequest(request, response) {
        const operation = await this.requestParser.handleSafe(request);
        const result = await this.operationHandler.handleSafe({ operation, request, response });
        this.logger.verbose(`Parsed ${operation.method} operation on ${operation.target.path}`);
        return result;
    }
    /**
     * Handles the error output correctly based on the preferences.
     */
    async handleError(error, request) {
        if (!HttpError_1.HttpError.isInstance(error)) {
            error = new InternalServerError_1.InternalServerError(`Received unexpected non-HttpError: ${(0, ErrorUtil_1.createErrorMessage)(error)}`, { cause: error });
        }
        return this.errorHandler.handleSafe({ error: error, request });
    }
}
exports.ParsingHttpHandler = ParsingHttpHandler;
//# sourceMappingURL=ParsingHttpHandler.js.map