import type { ClusterManager } from './cluster/ClusterManager';
import type { Finalizer } from './final/Finalizer';
import type { Initializer } from './Initializer';
/**
 * Entry point for the entire Solid server.
 */
export declare class App {
    private readonly initializer;
    private readonly finalizer;
    readonly clusterManager: ClusterManager;
    constructor(initializer: Initializer, finalizer: Finalizer, clusterManager: ClusterManager);
    /**
     * Initializes and starts the application.
     */
    start(): Promise<void>;
    /**
     * Stops the application and handles cleanup.
     */
    stop(): Promise<void>;
}
