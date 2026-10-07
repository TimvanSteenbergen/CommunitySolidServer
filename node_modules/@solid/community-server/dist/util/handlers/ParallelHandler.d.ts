import { AsyncHandler } from './AsyncHandler';
/**
 * A composite handler that executes handlers in parallel.
 */
export declare class ParallelHandler<TIn = void, TOut = void> extends AsyncHandler<TIn, TOut[]> {
    private readonly handlers;
    constructor(handlers: AsyncHandler<TIn, TOut>[]);
    canHandle(input: TIn): Promise<void>;
    handle(input: TIn): Promise<TOut[]>;
}
