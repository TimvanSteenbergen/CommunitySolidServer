"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratedPodManager = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const ConflictHttpError_1 = require("../util/errors/ConflictHttpError");
const GenerateUtil_1 = require("./generate/GenerateUtil");
/**
 * Pod manager that uses an {@link IdentifierGenerator} and {@link ResourcesGenerator}
 * to create the default resources and identifier for a new pod.
 */
class GeneratedPodManager {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    store;
    resourcesGenerator;
    constructor(store, resourcesGenerator) {
        this.store = store;
        this.resourcesGenerator = resourcesGenerator;
    }
    /**
     * Creates a new pod, pre-populating it with the resources created by the data generator.
     * Will throw an error if the given identifier already has a resource.
     */
    async createPod(settings, overwrite) {
        this.logger.info(`Creating pod ${settings.base.path}`);
        if (!overwrite && await this.store.hasResource(settings.base)) {
            throw new ConflictHttpError_1.ConflictHttpError(`There already is a resource at ${settings.base.path}`);
        }
        const count = await (0, GenerateUtil_1.addGeneratedResources)(settings, this.resourcesGenerator, this.store);
        this.logger.info(`Added ${count} resources to ${settings.base.path}`);
    }
}
exports.GeneratedPodManager = GeneratedPodManager;
//# sourceMappingURL=GeneratedPodManager.js.map