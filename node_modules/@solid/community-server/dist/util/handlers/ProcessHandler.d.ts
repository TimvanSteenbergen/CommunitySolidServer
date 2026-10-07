import type { ClusterManager } from '../../init/cluster/ClusterManager';
import { AsyncHandler } from './AsyncHandler';
/**
 * A wrapper handler that will only run the wrapped handler if it is executed from:
 * * when running multithreaded: either the **primary** or a **worker process**
 * * when running singlethreaded: **the only process** (i.e. always)
 */
export declare class ProcessHandler<TIn, TOut> extends AsyncHandler<TIn, TOut> {
    private readonly clusterManager;
    private readonly source;
    private readonly executeOnPrimary;
    /**
     * Creates a new ProcessHandler
     *
     * @param source - The wrapped handler
     * @param clusterManager - The ClusterManager in use
     * @param executeOnPrimary - Whether to execute the source handler when the process is the _primary_ or a _worker_.
     */
    constructor(source: AsyncHandler<TIn, TOut>, clusterManager: ClusterManager, executeOnPrimary: boolean);
    canHandle(input: TIn): Promise<void>;
    handle(input: TIn): Promise<TOut>;
    /**
     * Checks if the condition has already been fulfilled.
     */
    private canExecute;
}
