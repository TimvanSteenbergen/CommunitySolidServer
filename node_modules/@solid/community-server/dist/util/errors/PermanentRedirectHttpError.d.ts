import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./RedirectHttpError").RedirectHttpErrorClass<308>;
/**
 * Error used for resources that have been moved permanently.
 * Method and body should not be changed in subsequent requests.
 */
export declare class PermanentRedirectHttpError extends BaseHttpError {
    constructor(location: string, message?: string, options?: HttpErrorOptions);
}
export {};
