import type { ResponseDescription } from '../response/ResponseDescription';
import type { ErrorHandlerArgs } from './ErrorHandler';
import { ErrorHandler } from './ErrorHandler';
/**
 * Returns a simple text description of an error.
 * This class is a failsafe in case the wrapped error handler fails.
 */
export declare class SafeErrorHandler extends ErrorHandler {
    protected readonly logger: import("../../..").Logger;
    private readonly errorHandler;
    private readonly showStackTrace;
    constructor(errorHandler: ErrorHandler, showStackTrace?: boolean);
    handle(input: ErrorHandlerArgs): Promise<ResponseDescription>;
}
