import type { HttpErrorClass, HttpErrorOptions } from './HttpError';
import { HttpError } from './HttpError';
/**
 * An error corresponding to a 3xx status code.
 * Includes the location it redirects to.
 */
export declare class RedirectHttpError<TCode extends number = number> extends HttpError<TCode> {
    readonly location: string;
    constructor(statusCode: TCode, name: string, location: string, message?: string, options?: HttpErrorOptions);
    static isInstance(error: unknown): error is RedirectHttpError;
}
/**
 * Interface describing what a {@link RedirectHttpError} class should look like.
 * Makes sure a `location` value is always needed.
 */
export interface RedirectHttpErrorClass<TCode extends number = number> extends Omit<HttpErrorClass<TCode>, 'new'> {
    new (location: string, message?: string, options?: HttpErrorOptions): RedirectHttpError<TCode>;
}
/**
 * Generates a {@link RedirectHttpErrorClass}, similar to how {@link generateHttpErrorClass} works.
 * The difference is that here a `location` field also gets set and the `getInstance` method
 * also uses the {@link RedirectHttpError.isInstance} function.
 */
export declare function generateRedirectHttpErrorClass<TCode extends number>(code: TCode, name: string): RedirectHttpErrorClass<TCode>;
