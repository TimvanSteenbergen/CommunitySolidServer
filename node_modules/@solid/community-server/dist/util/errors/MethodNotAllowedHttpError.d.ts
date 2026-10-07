import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./HttpError").HttpErrorClass<405>;
/**
 * An error thrown when data was found for the requested identifier, but is not supported by the target resource.
 * Can keep track of the methods that are not allowed.
 */
export declare class MethodNotAllowedHttpError extends BaseHttpError {
    readonly methods: Readonly<string[]>;
    constructor(methods?: string[], message?: string, options?: HttpErrorOptions);
}
export {};
