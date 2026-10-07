import type { AsyncHandler, AsyncHandlerOutput } from './AsyncHandler';
import { UnionHandler } from './UnionHandler';
/**
 * A utility handler that concatenates the results of all its handlers into a single result.
 */
export declare class ArrayUnionHandler<T extends AsyncHandler<unknown, unknown[]>> extends UnionHandler<T> {
    constructor(handlers: T[], requireAll?: boolean, ignoreErrors?: boolean);
    protected combine(results: AsyncHandlerOutput<T>[]): Promise<AsyncHandlerOutput<T>>;
}
