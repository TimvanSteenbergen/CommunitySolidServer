import type { NamedNode } from '@rdfjs/types';
import { RepresentationMetadata } from '../../http/representation/RepresentationMetadata';
export interface HttpErrorOptions {
    cause?: unknown;
    errorCode?: string;
    metadata?: RepresentationMetadata;
}
/**
 * Returns a URI that is unique for the given status code.
 */
export declare function generateHttpErrorUri(statusCode: number): NamedNode;
/**
 * A class for all errors that could be thrown by Solid.
 * All errors inheriting from this should fix the status code thereby hiding the HTTP internals from other components.
 */
export declare class HttpError<T extends number = number> extends Error implements HttpErrorOptions {
    readonly statusCode: T;
    readonly cause?: unknown;
    readonly errorCode: string;
    readonly metadata: RepresentationMetadata;
    /**
     * Creates a new HTTP error. Subclasses should call this with their fixed status code.
     *
     * @param statusCode - HTTP status code needed for the HTTP response.
     * @param name - Error name. Useful for logging and stack tracing.
     * @param message - Error message.
     * @param options - Optional options.
     */
    constructor(statusCode: T, name: string, message?: string, options?: HttpErrorOptions);
    static isInstance(error: unknown): error is HttpError;
    /**
     * Initializes the error metadata.
     */
    protected generateMetadata(): void;
}
/**
 * Interface describing what an HttpError class should look like.
 * This helps us make sure all HttpError classes have the same utility static functions.
 */
export interface HttpErrorClass<TCode extends number = number> {
    new (message?: string, options?: HttpErrorOptions): HttpError<TCode>;
    /**
     * The status code corresponding to this error class.
     */
    readonly statusCode: TCode;
    /**
     * A unique URI identifying this error class.
     */
    readonly uri: NamedNode;
    /**
     * Checks whether the given error is an instance of this class.
     */
    readonly isInstance: (error: unknown) => error is HttpError<TCode>;
}
/**
 * Generates a new HttpError class with the given status code and name.
 * In general, status codes are used to uniquely identify error types,
 * so there should be no 2 classes with the same value there.
 *
 * To make sure Components.js can work with these newly generated classes,
 * the generated class should be called `BaseHttpError` as that name is an entry in `.componentsignore`.
 * The actual class should then extend `BaseHttpError` and have a correct constructor,
 * so the Components.js generator can generate the correct components JSON-LD file during build.
 */
export declare function generateHttpErrorClass<TCode extends number>(statusCode: TCode, name: string): HttpErrorClass<TCode>;
