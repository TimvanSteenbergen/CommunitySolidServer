import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./HttpError").HttpErrorClass<412>;
/**
 * An error thrown when access was denied due to the conditions on the request.
 */
export declare class PreconditionFailedHttpError extends BaseHttpError {
    constructor(message?: string, options?: HttpErrorOptions);
}
export {};
