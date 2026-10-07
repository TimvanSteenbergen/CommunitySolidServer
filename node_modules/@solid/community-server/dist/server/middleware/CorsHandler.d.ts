import type { HttpHandlerInput } from '../HttpHandler';
import { HttpHandler } from '../HttpHandler';
interface SimpleCorsOptions {
    origin?: string;
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
}
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
export declare class CorsHandler extends HttpHandler {
    private readonly corsHandler;
    constructor(options?: SimpleCorsOptions);
    handle(input: HttpHandlerInput): Promise<void>;
}
export {};
