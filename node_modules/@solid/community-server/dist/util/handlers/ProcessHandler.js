"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessHandler = void 0;
const NotImplementedHttpError_1 = require("../errors/NotImplementedHttpError");
const AsyncHandler_1 = require("./AsyncHandler");
/**
 * A wrapper handler that will only run the wrapped handler if it is executed from:
 * * when running multithreaded: either the **primary** or a **worker process**
 * * when running singlethreaded: **the only process** (i.e. always)
 */
class ProcessHandler extends AsyncHandler_1.AsyncHandler {
    clusterManager;
    source;
    executeOnPrimary;
    /**
     * Creates a new ProcessHandler
     *
     * @param source - The wrapped handler
     * @param clusterManager - The ClusterManager in use
     * @param executeOnPrimary - Whether to execute the source handler when the process is the _primary_ or a _worker_.
     */
    constructor(source, clusterManager, executeOnPrimary) {
        super();
        this.source = source;
        this.clusterManager = clusterManager;
        this.executeOnPrimary = executeOnPrimary;
    }
    async canHandle(input) {
        if (!this.canExecute()) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Will not execute on ${this.executeOnPrimary ? 'worker' : 'primary'} process.`);
        }
        await this.source.canHandle(input);
    }
    async handle(input) {
        return this.source.handle(input);
    }
    /**
     * Checks if the condition has already been fulfilled.
     */
    canExecute() {
        return this.clusterManager.isSingleThreaded() ||
            (this.executeOnPrimary ? this.clusterManager.isPrimary() : this.clusterManager.isWorker());
    }
}
exports.ProcessHandler = ProcessHandler;
//# sourceMappingURL=ProcessHandler.js.map