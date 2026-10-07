"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerManager = void 0;
const Initializer_1 = require("../Initializer");
/**
 * Spawns the necessary workers when starting in multithreaded mode.
 */
class WorkerManager extends Initializer_1.Initializer {
    clusterManager;
    constructor(clusterManager) {
        super();
        this.clusterManager = clusterManager;
    }
    async handle() {
        if (!this.clusterManager.isSingleThreaded()) {
            this.clusterManager.spawnWorkers();
        }
    }
}
exports.WorkerManager = WorkerManager;
//# sourceMappingURL=WorkerManager.js.map