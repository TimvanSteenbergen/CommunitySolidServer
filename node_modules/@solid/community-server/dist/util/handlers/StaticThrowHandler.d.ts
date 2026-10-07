import type { HttpError } from '../errors/HttpError';
import { AsyncHandler } from './AsyncHandler';
/**
 * Utility handler that can handle all input and always throws an instance of the given error.
 */
export declare class StaticThrowHandler extends AsyncHandler<unknown, never> {
    protected readonly error: HttpError;
    constructor(error: HttpError);
    handle(): Promise<never>;
}
