"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashMap = void 0;
const IterableUtil_1 = require("../IterableUtil");
/**
 * A {@link Map} implementation that maps the Key object to a string using the provided hash function.
 * This ensures that equal objects that are not the same instance are mapped to the same value.
 */
class HashMap {
    hashMap;
    hashFn;
    constructor(hashFn, iterable) {
        this.hashFn = hashFn;
        if (iterable) {
            this.hashMap = new Map((0, IterableUtil_1.map)(iterable, ([key, value]) => [this.hashFn(key), { key, value }]));
        }
        else {
            this.hashMap = new Map();
        }
    }
    has(key) {
        return this.hashMap.has(this.hashFn(key));
    }
    get(key) {
        return this.hashMap.get(this.hashFn(key))?.value;
    }
    set(key, value) {
        this.hashMap.set(this.hashFn(key), { key, value });
        return this;
    }
    delete(key) {
        return this.hashMap.delete(this.hashFn(key));
    }
    clear() {
        this.hashMap.clear();
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    *entries() {
        for (const [, { key, value }] of this.hashMap) {
            yield [key, value];
        }
    }
    *keys() {
        for (const [, { key }] of this.hashMap) {
            yield key;
        }
    }
    *values() {
        for (const [, { value }] of this.hashMap) {
            yield value;
        }
    }
    forEach(callbackfn, thisArg) {
        for (const [key, value] of this) {
            callbackfn.bind(thisArg)(value, key, this);
        }
    }
    get size() {
        return this.hashMap.size;
    }
    [Symbol.toStringTag] = 'HashMap';
}
exports.HashMap = HashMap;
//# sourceMappingURL=HashMap.js.map