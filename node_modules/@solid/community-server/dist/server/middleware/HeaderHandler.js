"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderHandler = void 0;
const HttpHandler_1 = require("../HttpHandler");
/**
 * Handler that sets custom headers on the response.
 */
class HeaderHandler extends HttpHandler_1.HttpHandler {
    headers;
    constructor(headers) {
        super();
        this.headers = { ...headers };
    }
    async handle({ response }) {
        for (const header of Object.keys(this.headers)) {
            response.setHeader(header, this.headers[header]);
        }
    }
}
exports.HeaderHandler = HeaderHandler;
//# sourceMappingURL=HeaderHandler.js.map