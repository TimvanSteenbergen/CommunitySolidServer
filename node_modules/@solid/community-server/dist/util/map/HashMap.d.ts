/**
 * A {@link Map} implementation that maps the Key object to a string using the provided hash function.
 * This ensures that equal objects that are not the same instance are mapped to the same value.
 */
export declare class HashMap<TKey = unknown, TVal = unknown> implements Map<TKey, TVal> {
    private readonly hashMap;
    private readonly hashFn;
    constructor(hashFn: (key: TKey) => string, iterable?: Iterable<readonly [TKey, TVal]>);
    has(key: TKey): boolean;
    get(key: TKey): TVal | undefined;
    set(key: TKey, value: TVal): this;
    delete(key: TKey): boolean;
    clear(): void;
    [Symbol.iterator](): IterableIterator<[TKey, TVal]>;
    entries(): IterableIterator<[TKey, TVal]>;
    keys(): IterableIterator<TKey>;
    values(): IterableIterator<TVal>;
    forEach(callbackfn: (value: TVal, key: TKey, map: Map<TKey, TVal>) => void, thisArg?: unknown): void;
    get size(): number;
    readonly [Symbol.toStringTag] = "HashMap";
}
