"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationInteractionHandler = void 0;
const RepresentationMetadata_1 = require("../../http/representation/RepresentationMetadata");
const LogUtil_1 = require("../../logging/LogUtil");
const RedirectHttpError_1 = require("../../util/errors/RedirectHttpError");
const Vocabularies_1 = require("../../util/Vocabularies");
const JsonInteractionHandler_1 = require("./JsonInteractionHandler");
/**
 * Transforms an HTTP redirect into a hypermedia document with a redirection link,
 * such that scripts running in a browser can redirect the user to the next page.
 *
 * This handler addresses the situation where:
 * - the user visits a first page
 * - this first page contains a script that performs interactions with a JSON API
 * - as a result of a certain interaction, the user needs to be redirected to a second page
 *
 * Regular HTTP redirects are performed via responses with 3xx status codes.
 * However, since the consumer of the API in this case is a browser script,
 * a 3xx response would only reach that script and not move the page for the user.
 *
 * Therefore, this handler changes a 3xx response into a 200 response
 * with an explicit link to the next page,
 * enabling the script to move the user to the next page.
 */
class LocationInteractionHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    source;
    constructor(source) {
        super();
        this.source = source;
    }
    async canHandle(input) {
        await this.source.canHandle(input);
    }
    async handle(input) {
        try {
            return await this.source.handle(input);
        }
        catch (error) {
            if (RedirectHttpError_1.RedirectHttpError.isInstance(error)) {
                this.logger.debug(`Converting redirect error to location field in JSON body with location ${error.location}`);
                const metadata = new RepresentationMetadata_1.RepresentationMetadata(input.target);
                metadata.set(Vocabularies_1.SOLID_HTTP.terms.location, error.location);
                return { json: { location: error.location }, metadata };
            }
            throw error;
        }
    }
}
exports.LocationInteractionHandler = LocationInteractionHandler;
//# sourceMappingURL=LocationInteractionHandler.js.map