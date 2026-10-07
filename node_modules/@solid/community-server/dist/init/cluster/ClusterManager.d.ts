/**
 * This class is responsible for deciding how many affective workers are needed.
 * It also contains the logic for respawning workers when they are killed by the os.
 *
 * The workers values are interpreted as follows:
 * value | actual workers |
 * ------|--------------|
 * `-m` | `num_cores - m` workers _(autoscale)_ (`m < num_cores`) |
 * `-1` | `num_cores - 1` workers _(autoscale)_ |
 * `0` | `num_cores` workers _(autoscale)_ |
 * `1` | `single threaded mode` _(default)_ |
 * `n` | `n` workers |
 */
export declare class ClusterManager {
    private readonly logger;
    private readonly workers;
    private readonly clusterMode;
    constructor(workers: number);
    /**
     * Spawn all required workers.
     */
    spawnWorkers(): void;
    /**
     * Check whether the CSS server was booted in single threaded mode.
     *
     * @returns True is single threaded.
     */
    isSingleThreaded(): boolean;
    /**
     * Whether the calling process is the primary process.
     *
     * @returns True if primary
     */
    isPrimary(): boolean;
    /**
     * Whether the calling process is a worker process.
     *
     * @returns True if worker
     */
    isWorker(): boolean;
}
