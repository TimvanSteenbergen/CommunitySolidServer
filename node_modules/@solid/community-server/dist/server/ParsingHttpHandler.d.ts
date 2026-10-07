import type { RequestParser } from '../http/input/RequestParser';
import type { ErrorHandler } from '../http/output/error/ErrorHandler';
import type { ResponseDescription } from '../http/output/response/ResponseDescription';
import type { ResponseWriter } from '../http/output/ResponseWriter';
import type { HttpHandlerInput } from './HttpHandler';
import { HttpHandler } from './HttpHandler';
import type { HttpRequest } from './HttpRequest';
import type { HttpResponse } from './HttpResponse';
import type { OperationHttpHandler } from './OperationHttpHandler';
export interface ParsingHttpHandlerArgs {
    /**
     * Parses the incoming requests.
     */
    requestParser: RequestParser;
    /**
     * Converts errors to a serializable format.
     */
    errorHandler: ErrorHandler;
    /**
     * Writes out the response of the operation.
     */
    responseWriter: ResponseWriter;
    /**
     * Handler to send the operation to.
     */
    operationHandler: OperationHttpHandler;
}
/**
 * Parses requests and sends the resulting {@link Operation} to the wrapped {@link OperationHttpHandler}.
 * Errors are caught and handled by the {@link ErrorHandler}.
 * In case the {@link OperationHttpHandler} returns a result it will be sent to the {@link ResponseWriter}.
 */
export declare class ParsingHttpHandler extends HttpHandler {
    private readonly logger;
    private readonly requestParser;
    private readonly errorHandler;
    private readonly responseWriter;
    private readonly operationHandler;
    constructor(args: ParsingHttpHandlerArgs);
    handle({ request, response }: HttpHandlerInput): Promise<void>;
    /**
     * Interprets the request and passes the generated Operation object to the stored OperationHttpHandler.
     */
    protected handleRequest(request: HttpRequest, response: HttpResponse): Promise<ResponseDescription>;
    /**
     * Handles the error output correctly based on the preferences.
     */
    protected handleError(error: unknown, request: HttpRequest): Promise<ResponseDescription>;
}
