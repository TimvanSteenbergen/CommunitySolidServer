import { HttpHandler } from '../HttpHandler';
import type { HttpResponse } from '../HttpResponse';
/**
 * Handler that advertises a WebSocket through the Updates-Via header.
 */
export declare class WebSocketAdvertiser extends HttpHandler {
    private readonly socketUrl;
    constructor(baseUrl: string);
    handle({ response }: {
        response: HttpResponse;
    }): Promise<void>;
}
