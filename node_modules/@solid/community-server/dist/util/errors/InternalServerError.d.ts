import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./HttpError").HttpErrorClass<500>;
/**
 * A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
 */
export declare class InternalServerError extends BaseHttpError {
    constructor(message?: string, options?: HttpErrorOptions);
}
export {};
