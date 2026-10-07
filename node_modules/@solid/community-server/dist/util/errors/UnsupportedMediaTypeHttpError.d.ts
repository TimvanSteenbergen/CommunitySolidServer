import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./HttpError").HttpErrorClass<415>;
/**
 * An error thrown when the media type of incoming data is not supported by a parser.
 */
export declare class UnsupportedMediaTypeHttpError extends BaseHttpError {
    constructor(message?: string, options?: HttpErrorOptions);
}
export {};
