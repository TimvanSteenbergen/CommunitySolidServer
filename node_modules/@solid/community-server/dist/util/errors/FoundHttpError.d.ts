import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./RedirectHttpError").RedirectHttpErrorClass<302>;
/**
 * Error used for resources that have been moved temporarily.
 * Methods other than GET may or may not be changed to GET in subsequent requests.
 */
export declare class FoundHttpError extends BaseHttpError {
    constructor(location: string, message?: string, options?: HttpErrorOptions);
}
export {};
