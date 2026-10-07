import { AsyncHandler } from './AsyncHandler';
type NestedMap<TOut> = TOut | WeakMap<object, NestedMap<TOut>>;
/**
 * Caches output data from the source handler based on the input object.
 * The `fields` parameter can be used to instead use one or more specific entries from the input object as cache key,
 * so has as actual required typing `(keyof TIn)[]`.
 *
 * A {@link WeakMap} is used internally so strict object equality determines cache hits,
 * and data will be removed once the key stops existing.
 * This also means that the cache key needs to be an object.
 * Errors will be thrown in case a primitive is used.
 */
export declare class CachedHandler<TIn extends Record<string, unknown>, TOut = void> extends AsyncHandler<TIn, TOut> {
    private readonly source;
    private readonly fields?;
    private readonly cache;
    constructor(source: AsyncHandler<TIn, TOut>, fields?: string[]);
    canHandle(input: TIn): Promise<void>;
    handle(input: TIn): Promise<TOut>;
    /**
     * Extracts the values that will be used as keys from the input object.
     * In case the `fields` value was undefined, this will return an array containing the input object itself.
     */
    protected getKeys(input: TIn): [object, ...object[]];
    /**
     * Returns the `WeakMap` that contains actual objects that were cached,
     * so the last `WeakMap` in the chain of maps.
     *
     * Returns `undefined` if no such map exists because earlier keys were not cached.
     *
     * Will always return a map if `ensure` is set to true,
     * in such a case the intermediate maps will be created and added to the previous map.
     */
    protected findDestination(input: TIn, keys: object[], cache: WeakMap<object, NestedMap<TOut>>, ensure?: boolean): WeakMap<object, TOut> | undefined;
}
export {};
