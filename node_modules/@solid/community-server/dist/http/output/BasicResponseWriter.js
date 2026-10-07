"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicResponseWriter = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const ConversionUtil_1 = require("../../storage/conversion/ConversionUtil");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const StreamUtil_1 = require("../../util/StreamUtil");
const ResponseWriter_1 = require("./ResponseWriter");
/**
 * Writes to an {@link HttpResponse} based on the incoming {@link ResponseDescription}.
 */
class BasicResponseWriter extends ResponseWriter_1.ResponseWriter {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    metadataWriter;
    constructor(metadataWriter) {
        super();
        this.metadataWriter = metadataWriter;
    }
    async canHandle(input) {
        const contentType = input.result.metadata?.contentType;
        if ((0, ConversionUtil_1.isInternalContentType)(contentType)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Cannot serialize the internal content type ${contentType}`);
        }
    }
    async handle(input) {
        if (input.result.metadata) {
            await this.metadataWriter.handleSafe({ response: input.response, metadata: input.result.metadata });
        }
        input.response.writeHead(input.result.statusCode);
        if (input.result.data) {
            const pipe = (0, StreamUtil_1.pipeSafely)(input.result.data, input.response);
            pipe.on('error', (error) => {
                this.logger.error(`Aborting streaming response because of server error; headers already sent.`);
                this.logger.error(`Response error: ${error.message}`);
            });
        }
        else {
            // If there is input data the response will end once the input stream ends
            input.response.end();
        }
    }
}
exports.BasicResponseWriter = BasicResponseWriter;
//# sourceMappingURL=BasicResponseWriter.js.map