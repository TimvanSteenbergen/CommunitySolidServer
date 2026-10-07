"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlerServerConfigurator = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const ErrorUtil_1 = require("../util/errors/ErrorUtil");
const GuardedStream_1 = require("../util/GuardedStream");
const ServerConfigurator_1 = require("./ServerConfigurator");
/**
 * A {@link ServerConfigurator} that attaches an {@link HttpHandler} to the `request` event of a {@link Server}.
 * All incoming requests will be sent to the provided handler.
 * Failsafes are added to make sure a valid response is sent in case something goes wrong.
 *
 * The `showStackTrace` parameter can be used to add stack traces to error outputs.
 */
class HandlerServerConfigurator extends ServerConfigurator_1.ServerConfigurator {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    errorLogger = (error) => {
        this.logger.error(`Request error: ${error.message}`);
    };
    /** The main HttpHandler */
    handler;
    showStackTrace;
    constructor(handler, showStackTrace = false) {
        super();
        this.handler = handler;
        this.showStackTrace = showStackTrace;
    }
    async handle(server) {
        server.on('request', 
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (request, response) => {
            try {
                this.logger.info(`Received ${request.method} request for ${request.url}`);
                const guardedRequest = (0, GuardedStream_1.guardStream)(request);
                guardedRequest.on('error', this.errorLogger);
                await this.handler.handleSafe({ request: guardedRequest, response });
            }
            catch (error) {
                const errMsg = this.createErrorMessage(error);
                this.logger.error(errMsg);
                if (response.headersSent) {
                    response.end();
                }
                else {
                    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
                    response.writeHead(500).end(errMsg);
                }
            }
            finally {
                if (!response.headersSent) {
                    response.writeHead(404).end();
                }
            }
        });
    }
    /**
     * Creates a readable error message based on the error and the `showStackTrace` parameter.
     */
    createErrorMessage(error) {
        if (!(0, ErrorUtil_1.isError)(error)) {
            return `Unknown error: ${error}.\n`;
        }
        if (this.showStackTrace && (0, ErrorUtil_1.isError)(error) && error.stack) {
            return `${error.stack}\n`;
        }
        return `${error.name}: ${error.message}\n`;
    }
}
exports.HandlerServerConfigurator = HandlerServerConfigurator;
//# sourceMappingURL=HandlerServerConfigurator.js.map