import type { TargetExtractor } from '../../http/input/identifier/TargetExtractor';
import type { ResponseWriter } from '../../http/output/ResponseWriter';
import type { HttpHandlerInput } from '../HttpHandler';
import { HttpHandler } from '../HttpHandler';
/**
 * Handler that redirects paths matching given patterns
 * to their corresponding URL, substituting selected groups.
 */
export declare class RedirectingHttpHandler extends HttpHandler {
    private readonly baseUrl;
    private readonly targetExtractor;
    private readonly responseWriter;
    private readonly statusCode;
    private readonly logger;
    private readonly redirects;
    /**
     * Creates a handler for the provided redirects.
     *
     * @param redirects - A mapping between URL patterns.
     * @param baseUrl - Base URL of the server.
     * @param targetExtractor - To extract the target from the request.
     * @param responseWriter - To write the redirect to the response.
     * @param statusCode - Desired 30x redirection code (defaults to 308).
     */
    constructor(redirects: Record<string, string>, baseUrl: string, targetExtractor: TargetExtractor, responseWriter: ResponseWriter, statusCode?: 301 | 302 | 303 | 307 | 308);
    canHandle({ request }: HttpHandlerInput): Promise<void>;
    handle({ request, response }: HttpHandlerInput): Promise<void>;
    private findRedirect;
}
