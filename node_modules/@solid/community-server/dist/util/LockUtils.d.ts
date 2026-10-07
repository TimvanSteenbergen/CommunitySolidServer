/**
 * Waits a set amount of time, without consuming cpu, with a set amount of jitter.
 *
 * @param delay - How long to wait.
 * @param jitter - A fraction of this jitter will be added to the delay.
 *
 * @returns A promise that resolves after the specified amount of time.
 */
export declare function setJitterTimeout(delay: number, jitter?: number): Promise<void>;
export interface AttemptSettings {
    /** How many times should an operation be retried. (-1 is indefinitely). */
    retryCount?: number;
    /** The how long should the next retry be delayed (+ some retryJitter) (in ms). */
    retryDelay?: number;
    /** Add a fraction of jitter to the original delay each attempt (in ms). */
    retryJitter?: number;
}
/**
 * Will execute the given function until one of the following cases occurs:
 * * The function resolves to a value: the value is returned.
 * * The function errors: the rejected error is thrown.
 * * The function did not resolve after the set amount of retries: the rejected error is returned.
 *
 * @param fn - The function to retry. **This function must return a value!**
 * @param settings - The options on how to retry the function
 */
export declare function retryFunction<T>(fn: () => Promise<T>, settings: Required<AttemptSettings>): Promise<T>;
