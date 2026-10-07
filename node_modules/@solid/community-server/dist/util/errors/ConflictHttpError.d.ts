import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./HttpError").HttpErrorClass<409>;
/**
 * An error thrown when a request conflict with current state of the server.
 */
export declare class ConflictHttpError extends BaseHttpError {
    constructor(message?: string, options?: HttpErrorOptions);
}
export {};
