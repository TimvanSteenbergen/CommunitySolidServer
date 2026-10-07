import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./HttpError").HttpErrorClass<416>;
/**
 * An error thrown when the requested range is not supported.
 */
export declare class RangeNotSatisfiedHttpError extends BaseHttpError {
    /**
     * Default message is 'The requested range is not supported.'.
     *
     * @param message - Optional, more specific, message.
     * @param options - Optional error options.
     */
    constructor(message?: string, options?: HttpErrorOptions);
}
export {};
