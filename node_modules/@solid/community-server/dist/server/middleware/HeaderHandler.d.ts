import { HttpHandler } from '../HttpHandler';
import type { HttpResponse } from '../HttpResponse';
/**
 * Handler that sets custom headers on the response.
 */
export declare class HeaderHandler extends HttpHandler {
    private readonly headers;
    constructor(headers: Record<string, string>);
    handle({ response }: {
        response: HttpResponse;
    }): Promise<void>;
}
