import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./RedirectHttpError").RedirectHttpErrorClass<307>;
/**
 * Error used for resources that have been moved temporarily.
 * Method and body should not be changed in subsequent requests.
 */
export declare class TemporaryRedirectHttpError extends BaseHttpError {
    constructor(location: string, message?: string, options?: HttpErrorOptions);
}
export {};
