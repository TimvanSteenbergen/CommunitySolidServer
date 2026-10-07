"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorToJsonConverter = void 0;
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const ContentTypes_1 = require("../../util/ContentTypes");
const ErrorUtil_1 = require("../../util/errors/ErrorUtil");
const HttpError_1 = require("../../util/errors/HttpError");
const HttpErrorUtil_1 = require("../../util/errors/HttpErrorUtil");
const OAuthHttpError_1 = require("../../util/errors/OAuthHttpError");
const StreamUtil_1 = require("../../util/StreamUtil");
const BaseTypedRepresentationConverter_1 = require("./BaseTypedRepresentationConverter");
/**
 * Converts an Error object to JSON by copying its fields.
 */
class ErrorToJsonConverter extends BaseTypedRepresentationConverter_1.BaseTypedRepresentationConverter {
    constructor() {
        super(ContentTypes_1.INTERNAL_ERROR, ContentTypes_1.APPLICATION_JSON);
    }
    async handle({ representation }) {
        const error = await (0, StreamUtil_1.getSingleItem)(representation.data);
        const result = this.errorToJson(error);
        // Update the content-type to JSON
        return new BasicRepresentation_1.BasicRepresentation(JSON.stringify(result), representation.metadata, ContentTypes_1.APPLICATION_JSON);
    }
    errorToJson(error) {
        if (!(0, ErrorUtil_1.isError)(error)) {
            // Try to see if we can make valid JSON, empty object if there is an error.
            try {
                return structuredClone(error);
            }
            catch {
                return {};
            }
        }
        const result = {
            name: error.name,
            message: error.message,
        };
        if (error.stack) {
            result.stack = error.stack;
        }
        if (!HttpError_1.HttpError.isInstance(error)) {
            return result;
        }
        result.statusCode = error.statusCode;
        result.errorCode = error.errorCode;
        result.details = (0, HttpErrorUtil_1.extractErrorTerms)(error.metadata);
        // OAuth errors responses require additional fields
        if (OAuthHttpError_1.OAuthHttpError.isInstance(error)) {
            Object.assign(result, error.mandatoryFields);
        }
        if (error.cause) {
            result.cause = this.errorToJson(error.cause);
        }
        return result;
    }
}
exports.ErrorToJsonConverter = ErrorToJsonConverter;
//# sourceMappingURL=ErrorToJsonConverter.js.map