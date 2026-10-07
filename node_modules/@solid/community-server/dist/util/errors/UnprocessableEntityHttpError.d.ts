import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./HttpError").HttpErrorClass<422>;
/**
 * An error thrown when the server understands the content-type but can't process the instructions.
 */
export declare class UnprocessableEntityHttpError extends BaseHttpError {
    constructor(message?: string, options?: HttpErrorOptions);
}
export {};
