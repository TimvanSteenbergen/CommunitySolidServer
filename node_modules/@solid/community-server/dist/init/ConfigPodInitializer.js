"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigPodInitializer = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const Variables_1 = require("../pods/generate/variables/Variables");
const Initializer_1 = require("./Initializer");
/**
 * Initializes all pods that have been stored and loads them in memory.
 * This reads the pod settings from a permanent storage and uses those
 * to create the corresponding ResourceStores in memory,
 * so this is required every time the server starts.
 *
 * Part of the dynamic pod creation.
 * Reads the contents from the configuration storage, uses those values to instantiate ResourceStores,
 * and then adds them to the routing storage.
 *
 * @see {@link ConfigPodManager}, {@link TemplatedPodGenerator}, {@link BaseUrlRouterRule}
 */
class ConfigPodInitializer extends Initializer_1.Initializer {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    storeFactory;
    configStorage;
    routingStorage;
    constructor(storeFactory, configStorage, routingStorage) {
        super();
        this.storeFactory = storeFactory;
        this.configStorage = configStorage;
        this.routingStorage = routingStorage;
    }
    async handle() {
        let count = 0;
        for await (const [path, value] of this.configStorage.entries()) {
            const config = value;
            const store = await this.storeFactory.generate(config[Variables_1.TEMPLATE_VARIABLE.templateConfig], Variables_1.TEMPLATE.ResourceStore, config);
            await this.routingStorage.set(path, store);
            this.logger.debug(`Initialized pod at ${path}`);
            count += 1;
        }
        this.logger.info(`Initialized ${count} dynamic pods.`);
    }
}
exports.ConfigPodInitializer = ConfigPodInitializer;
//# sourceMappingURL=ConfigPodInitializer.js.map