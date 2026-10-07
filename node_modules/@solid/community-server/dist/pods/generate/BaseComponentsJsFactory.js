"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseComponentsJsFactory = void 0;
const componentsjs_1 = require("componentsjs");
const PathUtil_1 = require("../../util/PathUtil");
/**
 * Can be used to instantiate objects using Components.js.
 * Default main module path is the root folder of the project.
 * For every generate call a new manager will be made,
 * but moduleState will be stored in between calls.
 */
class BaseComponentsJsFactory {
    options;
    constructor(relativeModulePath = '../../../', logLevel = 'error') {
        this.options = {
            mainModulePath: (0, PathUtil_1.joinFilePath)(__dirname, relativeModulePath),
            logLevel: logLevel,
            dumpErrorState: false,
            typeChecking: false,
        };
    }
    async buildManager() {
        const manager = await componentsjs_1.ComponentsManager.build(this.options);
        this.options.moduleState = manager.moduleState;
        return manager;
    }
    /**
     * Calls Components.js to instantiate a new object.
     *
     * @param configPath - Location of the config to instantiate.
     * @param componentIri - Iri of the object in the config that will be the result.
     * @param variables - Variables to send to Components.js
     *
     * @returns The resulting object, corresponding to the given component IRI.
     */
    async generate(configPath, componentIri, variables) {
        const manager = await this.buildManager();
        await manager.configRegistry.register(configPath);
        return manager.instantiate(componentIri, { variables });
    }
}
exports.BaseComponentsJsFactory = BaseComponentsJsFactory;
//# sourceMappingURL=BaseComponentsJsFactory.js.map