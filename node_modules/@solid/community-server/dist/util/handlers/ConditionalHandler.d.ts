import type { KeyValueStorage } from '../../storage/keyvalue/KeyValueStorage';
import { AsyncHandler } from './AsyncHandler';
/**
 * This handler will pass all requests to the wrapped handler,
 * until a specific value has been set in the given storage.
 * After that all input will be rejected.
 * Once the value has been matched this behaviour will be cached,
 * so changing the value again afterwards will not enable this handler again.
 *
 * If `handleStorage` is set to `true`,
 * this handler will set the value itself in the given storage after the source handler successfully resolved.
 */
export declare class ConditionalHandler<TIn, TOut> extends AsyncHandler<TIn, TOut> {
    private readonly source;
    private readonly storage;
    private readonly storageKey;
    private readonly storageValue;
    private readonly handleStorage;
    private finished;
    constructor(source: AsyncHandler<TIn, TOut>, storage: KeyValueStorage<string, unknown>, storageKey: string, storageValue: unknown, handleStorage?: boolean);
    canHandle(input: TIn): Promise<void>;
    handleSafe(input: TIn): Promise<TOut>;
    handle(input: TIn): Promise<TOut>;
    /**
     * Checks if the condition has already been fulfilled.
     */
    private checkCondition;
}
