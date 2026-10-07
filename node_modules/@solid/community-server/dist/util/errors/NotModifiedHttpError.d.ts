import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./HttpError").HttpErrorClass<304>;
/**
 * An error is thrown when a request conflicts with the current state of the server.
 */
export declare class NotModifiedHttpError extends BaseHttpError {
    constructor(eTag?: string, message?: string, options?: HttpErrorOptions);
}
export {};
