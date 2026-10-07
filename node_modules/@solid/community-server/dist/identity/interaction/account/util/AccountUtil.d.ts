import type { InteractionRoute } from '../../routing/InteractionRoute';
/**
 * Asserts that the ID is defined. Throws a 404 otherwise.
 */
export declare function assertAccountId(accountId?: string): asserts accountId is string;
/**
 * Parses the given path with the given {@link InteractionRoute}.
 * This assumes this call will succeed and thus expects the path to have the correct format.
 * If not, a 500 error will be thrown.
 *
 * @param route - Route to parse with.
 * @param path - Path to parse.
 */
export declare function parsePath<T extends InteractionRoute<string>>(route: T, path: string): NonNullable<ReturnType<T['matchPath']>>;
/**
 * Asserts that the two given IDs are identical.
 * To be used when a request tries to access a resource to ensure they're not accessing someone else's data.
 *
 * @param input - Input ID.
 * @param expected - Expected ID.
 */
export declare function verifyAccountId(input?: string, expected?: string): asserts expected is string;
