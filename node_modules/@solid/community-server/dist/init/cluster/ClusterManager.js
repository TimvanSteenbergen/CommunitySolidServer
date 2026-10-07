"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterManager = void 0;
const node_cluster_1 = __importDefault(require("node:cluster"));
const node_os_1 = require("node:os");
const LogUtil_1 = require("../../logging/LogUtil");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
/**
 * Different cluster modes.
 */
var ClusterMode;
(function (ClusterMode) {
    /** Scales in relation to `core_count`. */
    ClusterMode[ClusterMode["autoScale"] = 0] = "autoScale";
    /** Single threaded mode, no clustering */
    ClusterMode[ClusterMode["singleThreaded"] = 1] = "singleThreaded";
    /** Fixed amount of workers being forked. (limited to core_count) */
    ClusterMode[ClusterMode["fixed"] = 2] = "fixed";
})(ClusterMode || (ClusterMode = {}));
/**
 * Convert workers amount to {@link ClusterMode}
 *
 * @param workers - Amount of workers
 *
 * @returns ClusterMode enum value
 */
function toClusterMode(workers) {
    if (workers <= 0) {
        return ClusterMode.autoScale;
    }
    if (workers === 1) {
        return ClusterMode.singleThreaded;
    }
    return ClusterMode.fixed;
}
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
class ClusterManager {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    workers;
    clusterMode;
    constructor(workers) {
        const cores = (0, node_os_1.cpus)().length;
        if (workers <= -cores) {
            throw new InternalServerError_1.InternalServerError('Invalid workers value (should be in the interval ]-num_cores, +∞).');
        }
        this.workers = toClusterMode(workers) === ClusterMode.autoScale ? cores + workers : workers;
        this.clusterMode = toClusterMode(this.workers);
    }
    /**
     * Spawn all required workers.
     */
    spawnWorkers() {
        let counter = 0;
        this.logger.info(`Setting up ${this.workers} workers`);
        for (let i = 0; i < this.workers; i++) {
            node_cluster_1.default.fork().on('message', (msg) => {
                this.logger.info(msg);
            });
        }
        node_cluster_1.default.on('online', (worker) => {
            this.logger.info(`Worker ${worker.process.pid} is listening`);
            counter += 1;
            if (counter === this.workers) {
                this.logger.info(`All ${this.workers} requested workers have been started.`);
            }
        });
        node_cluster_1.default.on('exit', (worker, code, signal) => {
            this.logger.warn(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
            this.logger.warn('Starting a new worker');
            node_cluster_1.default.fork().on('message', (msg) => {
                this.logger.info(msg);
            });
        });
    }
    /**
     * Check whether the CSS server was booted in single threaded mode.
     *
     * @returns True is single threaded.
     */
    isSingleThreaded() {
        return this.clusterMode === ClusterMode.singleThreaded;
    }
    /**
     * Whether the calling process is the primary process.
     *
     * @returns True if primary
     */
    isPrimary() {
        return node_cluster_1.default.isPrimary;
    }
    /**
     * Whether the calling process is a worker process.
     *
     * @returns True if worker
     */
    isWorker() {
        return node_cluster_1.default.isWorker;
    }
}
exports.ClusterManager = ClusterManager;
//# sourceMappingURL=ClusterManager.js.map