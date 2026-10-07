import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./HttpError").HttpErrorClass<501>;
/**
 * The server either does not recognize the request method, or it lacks the ability to fulfil the request.
 * Usually this implies future availability (e.g., a new feature of a web-service API).
 */
export declare class NotImplementedHttpError extends BaseHttpError {
    constructor(message?: string, options?: HttpErrorOptions);
}
export {};
