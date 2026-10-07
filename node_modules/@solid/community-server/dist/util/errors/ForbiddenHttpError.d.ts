import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./HttpError").HttpErrorClass<403>;
/**
 * An error thrown when an agent is not allowed to access data.
 */
export declare class ForbiddenHttpError extends BaseHttpError {
    constructor(message?: string, options?: HttpErrorOptions);
}
export {};
