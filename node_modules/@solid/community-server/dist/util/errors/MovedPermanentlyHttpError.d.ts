import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./RedirectHttpError").RedirectHttpErrorClass<301>;
/**
 * Error used for resources that have been moved permanently.
 * Methods other than GET may or may not be changed to GET in subsequent requests.
 */
export declare class MovedPermanentlyHttpError extends BaseHttpError {
    constructor(location: string, message?: string, options?: HttpErrorOptions);
}
export {};
