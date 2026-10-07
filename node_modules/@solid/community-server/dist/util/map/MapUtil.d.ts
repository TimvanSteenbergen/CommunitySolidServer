import type { SetMultiMap } from './SetMultiMap';
export type ArrayElement<TArray extends readonly unknown[]> = TArray[number];
export type EmptyObject = Record<string, never>;
export type MapKey<T> = T extends Map<infer TKey, unknown> ? TKey : never;
export type MapValue<T> = T extends Map<unknown, infer TValue> ? TValue : never;
export type MapEntry<T> = T extends Map<unknown, unknown> ? [MapKey<T>, MapValue<T>] : never;
/**
 * A simplified version of {@link MapConstructor} that only allows creating an empty {@link Map}.
 */
export type EmptyMapConstructor = new () => Map<unknown, unknown>;
/**
 * Options describing the necessary changes when calling {@link modify}.
 */
export type ModifyOptions<T extends SetMultiMap<unknown, unknown>> = {
    /**
     * Entries that need to be added to the Map.
     */
    add?: Iterable<MapEntry<T>>;
    /**
     * Keys that need to be removed from the Map.
     */
    remove?: Iterable<MapKey<T>>;
};
/**
 * Modifies a {@link SetMultiMap} in place by removing and adding the requested entries.
 * Removals happen before additions.
 *
 * @param map - Map to start from.
 * @param options - {@link ModifyOptions} describing the necessary changes.
 */
export declare function modify<T extends SetMultiMap<any, any>>(map: T, options: ModifyOptions<T>): T;
/**
 * Finds the result of calling `map.get(key)`.
 * If there is no result, it instead returns the result of the default function.
 * The Map will also be updated to assign that default value to the given key.
 *
 * @param map - Map to use.
 * @param key - Key to find the value for.
 * @param defaultFn - Function to generate default value to insert and return if no result was found.
 */
export declare function getDefault<TKey, TValue>(map: Map<TKey, TValue>, key: TKey, defaultFn: () => TValue): TValue;
/**
 * Finds the result of calling `map.get(key)`.
 * If there is no result, it instead returns the result of the default function.
 * The Map will also be updated to assign the resolved default value to the given key.
 *
 * @param map - Map to use.
 * @param key - Key to find the value for.
 * @param defaultFn - Function to generate default value to insert and return if no result was found.
 */
export declare function getDefault<TKey, TValue>(map: Map<TKey, TValue>, key: TKey, defaultFn: () => Promise<TValue>): Promise<TValue>;
