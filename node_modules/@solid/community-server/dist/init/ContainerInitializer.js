"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerInitializer = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const ErrorUtil_1 = require("../util/errors/ErrorUtil");
const PathUtil_1 = require("../util/PathUtil");
const Initializer_1 = require("./Initializer");
/**
 * Initializer that sets up a container.
 * Will copy all the files and folders in the given path to the corresponding documents and containers.
 */
class ContainerInitializer extends Initializer_1.Initializer {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    store;
    containerId;
    generator;
    storageKey;
    storage;
    constructor(args) {
        super();
        this.containerId = { path: (0, PathUtil_1.ensureTrailingSlash)((0, PathUtil_1.joinUrl)(args.baseUrl, args.path)) };
        this.store = args.store;
        this.generator = args.generator;
        this.storageKey = args.storageKey;
        this.storage = args.storage;
    }
    async handle() {
        this.logger.info(`Initializing container ${this.containerId.path}`);
        const resources = this.generator.generate(this.containerId, {});
        let count = 0;
        for await (const { identifier: resourceId, representation } of resources) {
            try {
                await this.store.setRepresentation(resourceId, representation);
                count += 1;
            }
            catch (error) {
                this.logger.warn(`Failed to create resource ${resourceId.path}: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            }
        }
        this.logger.info(`Initialized container ${this.containerId.path} with ${count} resources.`);
        // Mark the initialization as finished
        await this.storage.set(this.storageKey, true);
    }
}
exports.ContainerInitializer = ContainerInitializer;
//# sourceMappingURL=ContainerInitializer.js.map