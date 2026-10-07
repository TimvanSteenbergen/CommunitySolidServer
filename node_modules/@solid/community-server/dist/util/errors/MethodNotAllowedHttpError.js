"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodNotAllowedHttpError = void 0;
const Vocabularies_1 = require("../Vocabularies");
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(405, 'MethodNotAllowedHttpError');
/**
 * An error thrown when data was found for the requested identifier, but is not supported by the target resource.
 * Can keep track of the methods that are not allowed.
 */
class MethodNotAllowedHttpError extends BaseHttpError {
    // Components.js can't parse `readonly`
    // eslint-disable-next-line @typescript-eslint/array-type
    methods;
    constructor(methods = [], message, options) {
        super(message ?? `${methods.join(', ')} ${methods.length === 1 ? 'is' : 'are'} not allowed.`, options);
        // Can not override `generateMetadata` as `this.methods` is not defined yet
        for (const method of methods) {
            this.metadata.add(Vocabularies_1.SOLID_ERROR.terms.disallowedMethod, method);
        }
        this.methods = methods;
    }
}
exports.MethodNotAllowedHttpError = MethodNotAllowedHttpError;
//# sourceMappingURL=MethodNotAllowedHttpError.js.map