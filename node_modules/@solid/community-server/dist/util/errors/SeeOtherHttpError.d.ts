import type { HttpErrorOptions } from './HttpError';
declare const BaseHttpError: import("./RedirectHttpError").RedirectHttpErrorClass<303>;
/**
 * Error used to redirect not to the requested resource itself, but to another page,
 * for example a representation of a real-world object.
 * The method used to display this redirected page is always GET.
 */
export declare class SeeOtherHttpError extends BaseHttpError {
    constructor(location: string, message?: string, options?: HttpErrorOptions);
}
export {};
