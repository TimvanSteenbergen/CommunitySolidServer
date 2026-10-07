"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUrlExtractor = void 0;
const PathUtil_1 = require("../../../util/PathUtil");
const ShorthandExtractor_1 = require("./ShorthandExtractor");
/**
 * A {@link ShorthandExtractor} that that generates the base URL based on the input `baseUrl` value,
 * or by using the port if the first isn't provided.
 */
class BaseUrlExtractor extends ShorthandExtractor_1.ShorthandExtractor {
    defaultPort;
    constructor(defaultPort = 3000) {
        super();
        this.defaultPort = defaultPort;
    }
    async handle(args) {
        if (typeof args.baseUrl === 'string') {
            return (0, PathUtil_1.ensureTrailingSlash)(args.baseUrl);
        }
        if (typeof args.socket === 'string') {
            throw new TypeError('BaseUrl argument should be provided when using Unix Domain Sockets.');
        }
        const port = args.port ?? this.defaultPort;
        const url = new URL('http://localhost/');
        url.port = port;
        return url.href;
    }
}
exports.BaseUrlExtractor = BaseUrlExtractor;
//# sourceMappingURL=BaseUrlExtractor.js.map