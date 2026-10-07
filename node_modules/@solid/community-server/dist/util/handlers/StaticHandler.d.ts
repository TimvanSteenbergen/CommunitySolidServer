import { AsyncHandler } from './AsyncHandler';
/**
 * A handler that always resolves and always returns the stored value.
 * Will return undefined if no value is stored.
 *
 * The generic type extends `any` due to Components.js requirements.
 */
export declare class StaticHandler<T = void> extends AsyncHandler<unknown, T> {
    private readonly value?;
    constructor(value?: T);
    handle(): Promise<T>;
}
