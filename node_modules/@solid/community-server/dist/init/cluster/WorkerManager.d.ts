import { Initializer } from '../Initializer';
import type { ClusterManager } from './ClusterManager';
/**
 * Spawns the necessary workers when starting in multithreaded mode.
 */
export declare class WorkerManager extends Initializer {
    private readonly clusterManager;
    constructor(clusterManager: ClusterManager);
    handle(): Promise<void>;
}
