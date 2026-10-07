"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OidcHttpHandler = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const HttpHandler_1 = require("../server/HttpHandler");
/**
 * HTTP handler that redirects all requests to the OIDC library.
 */
class OidcHttpHandler extends HttpHandler_1.HttpHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    providerFactory;
    constructor(providerFactory) {
        super();
        this.providerFactory = providerFactory;
    }
    async handle({ request, response }) {
        const provider = await this.providerFactory.getProvider();
        // Rewrite requests to allow hosting on root paths
        const path = new URL(provider.issuer).pathname;
        if (path.length > 1 && request.url.startsWith(`${path}.well-known/openid-configuration`)) {
            request.url = request.url.replace(path, '/');
        }
        this.logger.debug(`Sending request to oidc-provider: ${request.url}`);
        // Even though the typings do not indicate this, this is a Promise that needs to be awaited.
        // Otherwise, the `BaseHttpServerFactory` will write a 404 before the OIDC library could handle the response.
        // eslint-disable-next-line @typescript-eslint/await-thenable,@typescript-eslint/no-confusing-void-expression
        await provider.callback()(request, response);
    }
}
exports.OidcHttpHandler = OidcHttpHandler;
//# sourceMappingURL=OidcHttpHandler.js.map