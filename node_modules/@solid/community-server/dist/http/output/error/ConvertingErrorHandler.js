"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertingErrorHandler = void 0;
const ContentTypes_1 = require("../../../util/ContentTypes");
const BasicRepresentation_1 = require("../../representation/BasicRepresentation");
const ErrorHandler_1 = require("./ErrorHandler");
/**
 * Converts an error into a Representation of content type internal/error.
 * Then feeds that representation into its converter to create a representation based on the given preferences.
 */
class ConvertingErrorHandler extends ErrorHandler_1.ErrorHandler {
    converter;
    preferenceParser;
    showStackTrace;
    constructor(converter, preferenceParser, showStackTrace = false) {
        super();
        this.converter = converter;
        this.preferenceParser = preferenceParser;
        this.showStackTrace = showStackTrace;
    }
    async canHandle(input) {
        await this.preferenceParser.canHandle({ request: input.request });
        const { conversionArgs } = await this.extractErrorDetails(input);
        await this.converter.canHandle(conversionArgs);
    }
    async handle(input) {
        const { statusCode, conversionArgs } = await this.extractErrorDetails(input);
        const converted = await this.converter.handle(conversionArgs);
        return this.createResponse(statusCode, converted);
    }
    async handleSafe(input) {
        await this.preferenceParser.canHandle({ request: input.request });
        const { statusCode, conversionArgs } = await this.extractErrorDetails(input);
        const converted = await this.converter.handleSafe(conversionArgs);
        return this.createResponse(statusCode, converted);
    }
    /**
     * Prepares the arguments used by all functions.
     */
    async extractErrorDetails({ error, request }) {
        if (!this.showStackTrace) {
            delete error.stack;
            // Cheating here to delete a readonly field
            delete error.cause;
        }
        const representation = new BasicRepresentation_1.BasicRepresentation([error], error.metadata, ContentTypes_1.INTERNAL_ERROR, false);
        const identifier = { path: representation.metadata.identifier.value };
        const preferences = await this.preferenceParser.handle({ request });
        return { statusCode: error.statusCode, conversionArgs: { identifier, representation, preferences } };
    }
    /**
     * Creates a ResponseDescription based on the Representation.
     */
    createResponse(statusCode, converted) {
        return {
            statusCode,
            metadata: converted.metadata,
            data: converted.data,
        };
    }
}
exports.ConvertingErrorHandler = ConvertingErrorHandler;
//# sourceMappingURL=ConvertingErrorHandler.js.map