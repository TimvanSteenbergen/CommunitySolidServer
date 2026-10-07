"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigPodManager = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const GenerateUtil_1 = require("./generate/GenerateUtil");
/**
 * Pod manager that creates a store for the pod with a {@link PodGenerator}
 * and fills it with resources from a {@link ResourcesGenerator}.
 *
 * Part of the dynamic pod creation.
 *  1. Calls a PodGenerator to instantiate a new resource store for the pod.
 *  2. Generates the pod resources based on the templates as usual.
 *  3. Adds the created pod to the routing storage, which is used for linking pod identifiers to their resource stores.
 *
 * @see {@link TemplatedPodGenerator}, {@link ConfigPodInitializer}, {@link BaseUrlRouterRule}
 */
class ConfigPodManager {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    podGenerator;
    routingStorage;
    resourcesGenerator;
    store;
    /**
     * @param podGenerator - Generator for the pod stores.
     * @param resourcesGenerator - Generator for the pod resources.
     * @param routingStorage - Where to store the generated pods so they can be routed to.
     * @param store - The default ResourceStore
     */
    constructor(podGenerator, resourcesGenerator, routingStorage, store) {
        this.podGenerator = podGenerator;
        this.routingStorage = routingStorage;
        this.resourcesGenerator = resourcesGenerator;
        this.store = store;
    }
    async createPod(settings) {
        this.logger.info(`Creating pod ${settings.base.path}`);
        // Will error in case there already is a store for the given identifier
        const store = await this.podGenerator.generate(settings);
        await this.routingStorage.set(settings.base.path, store);
        const count = await (0, GenerateUtil_1.addGeneratedResources)(settings, this.resourcesGenerator, this.store);
        this.logger.info(`Added ${count} resources to ${settings.base.path}`);
    }
}
exports.ConfigPodManager = ConfigPodManager;
//# sourceMappingURL=ConfigPodManager.js.map