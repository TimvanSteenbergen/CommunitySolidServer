"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormToJsonConverter = void 0;
const node_querystring_1 = require("node:querystring");
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const RepresentationMetadata_1 = require("../../http/representation/RepresentationMetadata");
const ContentTypes_1 = require("../../util/ContentTypes");
const StreamUtil_1 = require("../../util/StreamUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const BaseTypedRepresentationConverter_1 = require("./BaseTypedRepresentationConverter");
/**
 * Converts application/x-www-form-urlencoded data to application/json.
 * Due to the nature of form data, the result will be a simple key/value JSON object.
 */
class FormToJsonConverter extends BaseTypedRepresentationConverter_1.BaseTypedRepresentationConverter {
    constructor() {
        super(ContentTypes_1.APPLICATION_X_WWW_FORM_URLENCODED, ContentTypes_1.APPLICATION_JSON);
    }
    async handle({ representation }) {
        const body = await (0, StreamUtil_1.readableToString)(representation.data);
        const json = JSON.stringify((0, node_querystring_1.parse)(body));
        const metadata = new RepresentationMetadata_1.RepresentationMetadata(representation.metadata, { [Vocabularies_1.CONTENT_TYPE]: ContentTypes_1.APPLICATION_JSON });
        return new BasicRepresentation_1.BasicRepresentation(json, metadata);
    }
}
exports.FormToJsonConverter = FormToJsonConverter;
//# sourceMappingURL=FormToJsonConverter.js.map