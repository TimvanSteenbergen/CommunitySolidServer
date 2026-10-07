"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
/**
 * Entry point for the entire Solid server.
 */
class App {
    initializer;
    finalizer;
    clusterManager;
    constructor(initializer, finalizer, clusterManager) {
        this.initializer = initializer;
        this.finalizer = finalizer;
        this.clusterManager = clusterManager;
    }
    /**
     * Initializes and starts the application.
     */
    async start() {
        await this.initializer.handleSafe();
    }
    /**
     * Stops the application and handles cleanup.
     */
    async stop() {
        await this.finalizer.handleSafe();
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map