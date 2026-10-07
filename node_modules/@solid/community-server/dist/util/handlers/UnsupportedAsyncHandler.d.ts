import { AsyncHandler } from './AsyncHandler';
/**
 * Handler that does not support any input and will always throw an error.
 */
export declare class UnsupportedAsyncHandler extends AsyncHandler<unknown, never> {
    private readonly errorMessage?;
    constructor(errorMessage?: string);
    canHandle(): Promise<never>;
    handle(): Promise<never>;
}
