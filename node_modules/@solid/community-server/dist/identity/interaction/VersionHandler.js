"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionHandler = void 0;
const JsonInteractionHandler_1 = require("./JsonInteractionHandler");
const INTERNAL_API_VERSION = '0.5';
/**
 * Adds the current version of the API to the JSON output.
 * This version number should be updated every time the API changes.
 */
class VersionHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    source;
    constructor(source) {
        super();
        this.source = source;
    }
    async canHandle(input) {
        await this.source.canHandle(input);
    }
    async handle(input) {
        const result = await this.source.handle(input);
        result.json.version = INTERNAL_API_VERSION;
        return result;
    }
}
exports.VersionHandler = VersionHandler;
//# sourceMappingURL=VersionHandler.js.map