import { ResponseDescription } from '../response/ResponseDescription';
import type { ErrorHandlerArgs } from './ErrorHandler';
import { ErrorHandler } from './ErrorHandler';
/**
 * An {@link ErrorHandler} that returns an error response without adding a body.
 * For certain status codes, such as 304, it is important to not change anything
 * in the headers, such as content-type.
 *
 * The `statusCodes` array contains the status codes of error types for which
 * a body should never be added.
 *
 * The `always` boolean can be set to `true` to indicate that all errors should
 * be handled here.
 *
 * For errors with different status codes, a metadata field can be added
 * to indicate that this specific error response should not receive a body.
 * The predicate should be `urn:npm:solid:community-server:error:emptyBody`
 * and the value `true`.
 */
export declare class EmptyErrorHandler extends ErrorHandler {
    protected readonly statusCodes: number[];
    protected readonly always: boolean;
    constructor(statusCodes?: number[], always?: boolean);
    canHandle({ error }: ErrorHandlerArgs): Promise<void>;
    handle({ error }: ErrorHandlerArgs): Promise<ResponseDescription>;
}
