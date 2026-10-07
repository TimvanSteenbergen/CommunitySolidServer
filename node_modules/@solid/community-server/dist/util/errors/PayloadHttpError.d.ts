import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./HttpError").HttpErrorClass<413>;
/**
 * An error thrown when data exceeded the preconfigured quota
 */
export declare class PayloadHttpError extends BaseHttpError {
    /**
     * Default message is 'Storage quota was exceeded.'.
     *
     * @param message - Optional, more specific, message.
     * @param options - Optional error options.
     */
    constructor(message?: string, options?: HttpErrorOptions);
}
export {};
