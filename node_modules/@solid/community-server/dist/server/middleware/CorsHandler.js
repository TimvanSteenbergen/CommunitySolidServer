"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorsHandler = void 0;
const cors_1 = __importDefault(require("cors"));
const HttpHandler_1 = require("../HttpHandler");
const defaultOptions = {
    origin: (origin, callback) => callback(null, origin ?? '*'),
};
/**
 * Handler that sets CORS options on the response.
 * In case of an OPTIONS request this handler will close the connection after adding its headers
 * if `preflightContinue` is set to `false`.
 *
 * Solid, §8.1: "A server MUST implement the CORS protocol [FETCH] such that, to the extent possible,
 * the browser allows Solid apps to send any request and combination of request headers to the server,
 * and the Solid app can read any response and response headers received from the server."
 * Full details: https://solidproject.org/TR/2021/protocol-20211217#cors-server
 */
class CorsHandler extends HttpHandler_1.HttpHandler {
    corsHandler;
    constructor(options = {}) {
        super();
        this.corsHandler = (0, cors_1.default)({ ...defaultOptions, ...options });
    }
    async handle(input) {
        return new Promise((resolve) => {
            this.corsHandler(input.request, input.response, () => resolve());
        });
    }
}
exports.CorsHandler = CorsHandler;
//# sourceMappingURL=CorsHandler.js.map