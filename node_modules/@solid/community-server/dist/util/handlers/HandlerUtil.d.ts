import type { AsyncHandler } from './AsyncHandler';
/**
 * Finds a handler that can handle the given input data.
 * Otherwise an error gets thrown.
 *
 * @param handlers - List of handlers to search in.
 * @param input - The input data.
 *
 * @returns A promise resolving to a handler that supports the data or otherwise rejecting.
 */
export declare function findHandler<TIn, TOut>(handlers: AsyncHandler<TIn, TOut>[], input: TIn): Promise<AsyncHandler<TIn, TOut>>;
/**
 * Filters a list of handlers to only keep those that can handle the input.
 * Will error if no matching handlers are found.
 *
 * @param handlers - Handlers to filter.
 * @param input - Input that needs to be supported.
 */
export declare function filterHandlers<TIn, TOut>(handlers: AsyncHandler<TIn, TOut>[], input: TIn): Promise<AsyncHandler<TIn, TOut>[]>;
