"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrappedSetMultiMap = void 0;
/**
 * A {@link SetMultiMap} that uses an internal Map based on the provided constructor.
 *
 * In case no input constructor is provided, the default Map implementation will be used.
 *
 * It is required that the value type of this map is not Set or any extension of Set,
 * otherwise the `set` and `add` functions wil break.
 */
class WrappedSetMultiMap {
    count;
    map;
    /**
     * @param mapConstructor - Will be used to instantiate the internal Map.
     * @param iterable - Entries to add to the map.
     */
    constructor(mapConstructor = Map, iterable) {
        // eslint-disable-next-line new-cap
        this.map = new mapConstructor();
        this.count = 0;
        if (iterable) {
            for (const [key, val] of iterable) {
                this.add(key, val);
            }
        }
    }
    has(key) {
        return this.map.has(key);
    }
    hasEntry(key, value) {
        return Boolean(this.map.get(key)?.has(value));
    }
    get(key) {
        return this.map.get(key);
    }
    set(key, value) {
        const setCount = this.get(key)?.size ?? 0;
        const set = value instanceof Set ? new Set(value) : new Set([value]);
        this.count += set.size - setCount;
        if (set.size > 0) {
            this.map.set(key, set);
        }
        else {
            this.map.delete(key);
        }
        return this;
    }
    add(key, value) {
        const it = value instanceof Set ? value : [value];
        let set = this.map.get(key);
        if (set) {
            const originalCount = set.size;
            for (const entry of it) {
                set.add(entry);
            }
            this.count += set.size - originalCount;
        }
        else {
            set = new Set(it);
            this.count += set.size;
            this.map.set(key, set);
        }
        return this;
    }
    delete(key) {
        const setCount = this.get(key)?.size ?? 0;
        const existed = this.map.delete(key);
        this.count -= setCount;
        return existed;
    }
    deleteEntry(key, value) {
        const set = this.map.get(key);
        if (set?.delete(value)) {
            this.count -= 1;
            if (set.size === 0) {
                this.map.delete(key);
            }
            return true;
        }
        return false;
    }
    clear() {
        this.map.clear();
        this.count = 0;
    }
    asMap() {
        return this.map;
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    *entries() {
        for (const [key, set] of this.map) {
            for (const value of set) {
                yield [key, value];
            }
        }
    }
    *entrySets() {
        yield* this.map.entries();
    }
    *keys() {
        for (const [key] of this.entries()) {
            yield key;
        }
    }
    distinctKeys() {
        return this.map.keys();
    }
    *values() {
        for (const [, value] of this.entries()) {
            yield value;
        }
    }
    valueSets() {
        return this.map.values();
    }
    forEach(callbackfn, thisArg) {
        for (const [key, value] of this) {
            callbackfn.bind(thisArg)(value, key, this);
        }
    }
    get size() {
        return this.count;
    }
    [Symbol.toStringTag] = 'WrappedSetMultiMap';
}
exports.WrappedSetMultiMap = WrappedSetMultiMap;
//# sourceMappingURL=WrappedSetMultiMap.js.map