import type { SetMultiMap } from './SetMultiMap';
/**
 * A {@link SetMultiMap} that uses an internal Map based on the provided constructor.
 *
 * In case no input constructor is provided, the default Map implementation will be used.
 *
 * It is required that the value type of this map is not Set or any extension of Set,
 * otherwise the `set` and `add` functions wil break.
 */
export declare class WrappedSetMultiMap<TKey, TVal> implements SetMultiMap<TKey, TVal> {
    private count;
    private readonly map;
    /**
     * @param mapConstructor - Will be used to instantiate the internal Map.
     * @param iterable - Entries to add to the map.
     */
    constructor(mapConstructor?: new () => Map<TKey, Set<TVal>>, iterable?: Iterable<readonly [TKey, TVal | ReadonlySet<TVal>]>);
    has(key: TKey): boolean;
    hasEntry(key: TKey, value: TVal): boolean;
    get(key: TKey): ReadonlySet<TVal> | undefined;
    set(key: TKey, value: ReadonlySet<TVal> | TVal): this;
    add(key: TKey, value: TVal | ReadonlySet<TVal>): this;
    delete(key: TKey): boolean;
    deleteEntry(key: TKey, value: TVal): boolean;
    clear(): void;
    asMap(): ReadonlyMap<TKey, ReadonlySet<TVal>>;
    [Symbol.iterator](): IterableIterator<[TKey, TVal]>;
    entries(): IterableIterator<[TKey, TVal]>;
    entrySets(): IterableIterator<[TKey, ReadonlySet<TVal>]>;
    keys(): IterableIterator<TKey>;
    distinctKeys(): IterableIterator<TKey>;
    values(): IterableIterator<TVal>;
    valueSets(): IterableIterator<ReadonlySet<TVal>>;
    forEach(callbackfn: (value: TVal, key: TKey, map: SetMultiMap<TKey, TVal>) => void, thisArg?: unknown): void;
    get size(): number;
    readonly [Symbol.toStringTag] = "WrappedSetMultiMap";
}
