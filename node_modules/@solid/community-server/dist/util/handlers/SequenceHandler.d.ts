import { AsyncHandler } from './AsyncHandler';
/**
 * A composite handler that will try to run all supporting handlers sequentially
 * and return the value of the last supported handler.
 * The `canHandle` check of this handler will always succeed.
 */
export declare class SequenceHandler<TIn = void, TOut = void> extends AsyncHandler<TIn, TOut | undefined> {
    private readonly handlers;
    constructor(handlers: AsyncHandler<TIn, TOut>[]);
    handle(input: TIn): Promise<TOut | undefined>;
}
