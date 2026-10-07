"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticInteractionHandler = void 0;
const JsonInteractionHandler_1 = require("./JsonInteractionHandler");
/**
 * An {@link JsonInteractionHandler} that always returns the same JSON response on all requests.
 */
class StaticInteractionHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    response;
    /**
     * @param response - @range {json}
     */
    constructor(response) {
        super();
        this.response = response;
    }
    async handle() {
        return { json: this.response };
    }
}
exports.StaticInteractionHandler = StaticInteractionHandler;
//# sourceMappingURL=StaticInteractionHandler.js.map