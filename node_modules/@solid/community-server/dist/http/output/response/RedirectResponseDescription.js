"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectResponseDescription = void 0;
const n3_1 = require("n3");
const Vocabularies_1 = require("../../../util/Vocabularies");
const ResponseDescription_1 = require("./ResponseDescription");
/**
 * Corresponds to a redirect response, containing the relevant location metadata.
 */
class RedirectResponseDescription extends ResponseDescription_1.ResponseDescription {
    constructor(error) {
        error.metadata.set(Vocabularies_1.SOLID_HTTP.terms.location, n3_1.DataFactory.namedNode(error.location));
        super(error.statusCode, error.metadata);
    }
}
exports.RedirectResponseDescription = RedirectResponseDescription;
//# sourceMappingURL=RedirectResponseDescription.js.map