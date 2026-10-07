"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectingHttpHandler = void 0;
const RedirectResponseDescription_1 = require("../../http/output/response/RedirectResponseDescription");
const LogUtil_1 = require("../../logging/LogUtil");
const FoundHttpError_1 = require("../../util/errors/FoundHttpError");
const MovedPermanentlyHttpError_1 = require("../../util/errors/MovedPermanentlyHttpError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const PermanentRedirectHttpError_1 = require("../../util/errors/PermanentRedirectHttpError");
const SeeOtherHttpError_1 = require("../../util/errors/SeeOtherHttpError");
const TemporaryRedirectHttpError_1 = require("../../util/errors/TemporaryRedirectHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const HttpHandler_1 = require("../HttpHandler");
/* eslint-disable @typescript-eslint/naming-convention */
const redirectErrorFactories = {
    301: (location) => new MovedPermanentlyHttpError_1.MovedPermanentlyHttpError(location),
    302: (location) => new FoundHttpError_1.FoundHttpError(location),
    303: (location) => new SeeOtherHttpError_1.SeeOtherHttpError(location),
    307: (location) => new TemporaryRedirectHttpError_1.TemporaryRedirectHttpError(location),
    308: (location) => new PermanentRedirectHttpError_1.PermanentRedirectHttpError(location),
};
/* eslint-enable @typescript-eslint/naming-convention */
/**
 * Handler that redirects paths matching given patterns
 * to their corresponding URL, substituting selected groups.
 */
class RedirectingHttpHandler extends HttpHandler_1.HttpHandler {
    baseUrl;
    targetExtractor;
    responseWriter;
    statusCode;
    logger = (0, LogUtil_1.getLoggerFor)(this);
    redirects;
    /**
     * Creates a handler for the provided redirects.
     *
     * @param redirects - A mapping between URL patterns.
     * @param baseUrl - Base URL of the server.
     * @param targetExtractor - To extract the target from the request.
     * @param responseWriter - To write the redirect to the response.
     * @param statusCode - Desired 30x redirection code (defaults to 308).
     */
    constructor(redirects, baseUrl, targetExtractor, responseWriter, statusCode = 308) {
        super();
        this.baseUrl = baseUrl;
        this.targetExtractor = targetExtractor;
        this.responseWriter = responseWriter;
        this.statusCode = statusCode;
        // Create an array of (regexp, redirect) pairs
        this.redirects = Object.keys(redirects).map((pattern) => ({
            regex: new RegExp(pattern, 'u'),
            redirectPattern: redirects[pattern],
        }));
    }
    async canHandle({ request }) {
        // Try to find redirect for target URL
        await this.findRedirect(request);
    }
    async handle({ request, response }) {
        // Try to find redirect for target URL
        const redirect = await this.findRedirect(request);
        // Send redirect response
        this.logger.info(`Redirecting ${request.url} to ${redirect}`);
        const result = new RedirectResponseDescription_1.RedirectResponseDescription(redirectErrorFactories[this.statusCode](redirect));
        await this.responseWriter.handleSafe({ response, result });
    }
    async findRedirect(request) {
        // Retrieve target relative to base URL
        const target = await (0, PathUtil_1.getRelativeUrl)(this.baseUrl, request, this.targetExtractor);
        // Get groups and redirect of first matching pattern
        let result;
        for (const { regex, redirectPattern } of this.redirects) {
            const match = regex.exec(target);
            if (match) {
                result = { match, redirectPattern };
                break;
            }
        }
        // Only return if a redirect is configured for the requested URL
        if (!result) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`No redirect configured for ${target}`);
        }
        // Build redirect URL from regexp result
        const { match, redirectPattern } = result;
        let redirect = redirectPattern;
        for (const [i, element] of match.entries()) {
            redirect = redirect.replace(`$${i}`, element);
        }
        // Don't redirect if target is already correct
        if (redirect === target) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Target is already correct.');
        }
        return /^(?:[a-z]+:)?\/\//iu.test(redirect) ? redirect : (0, PathUtil_1.joinUrl)(this.baseUrl, redirect);
    }
}
exports.RedirectingHttpHandler = RedirectingHttpHandler;
//# sourceMappingURL=RedirectingHttpHandler.js.map