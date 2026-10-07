export type PromiseOrValue<T> = T | Promise<T>;
/**
 * Verifies if the given value is a Promise or not.
 *
 * @param object - Object to check.
 */
export declare function isPromise<T>(object: PromiseOrValue<T>): object is Promise<T>;
/**
 * Calls `callback` with the resolved value of `object`.
 * In case `object` is a Promise, the result will also be a Promise,
 * otherwise the result will be sync.
 */
export declare function resolvePromiseOrValue<TIn, TOut>(object: PromiseOrValue<TIn>, callback: (val: TIn) => TOut): PromiseOrValue<TOut>;
/**
 * A function that simulates the Array.some behaviour but on an array of Promises.
 * Returns true if at least one promise returns true.
 * Returns false if all promises return false or error.
 *
 * @remarks
 *
 * Predicates provided as input must be implemented considering
 * the following points:
 * 1. if they throw an error, it won't be propagated;
 * 2. throwing an error should be logically equivalent to returning false.
 */
export declare function promiseSome(predicates: Promise<boolean>[]): Promise<boolean>;
/**
 * Obtains the values of all fulfilled promises.
 * If there are rejections (and `ignoreErrors` is false), throws a combined error of all rejected promises.
 */
export declare function allFulfilled<T>(promises: Promise<T>[], ignoreErrors?: boolean): Promise<T[]>;
