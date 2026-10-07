"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatedPodGenerator = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../util/errors/BadRequestHttpError");
const ConflictHttpError_1 = require("../../util/errors/ConflictHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const Variables_1 = require("./variables/Variables");
const DEFAULT_CONFIG_PATH = (0, PathUtil_1.joinFilePath)(__dirname, '../../../templates/config/');
/**
 * Creates a new ResourceStore when creating a pod based on a Components.js configuration.
 *
 * Part of the dynamic pod creation.
 *  1. It calls a VariableHandler to add necessary variable values.
 *     E.g. setting the base url variable for components.js to the pod identifier.
 *  2. It filters/cleans the input agent values using {@link VariableHandler}s
 *  3. It calls a ComponentsJsFactory with the variables and template location to instantiate a new ResourceStore.
 *  4. It stores these values in the configuration storage, which is used as a permanent storage for pod configurations.
 *
 * @see {@link ConfigPodManager}, {@link ConfigPodInitializer}, {@link BaseUrlRouterRule}
 */
class TemplatedPodGenerator {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    storeFactory;
    variableHandler;
    configStorage;
    configTemplatePath;
    baseUrl;
    /**
     * @param storeFactory - Factory used for Components.js instantiation.
     * @param variableHandler - Handler used for setting variable values.
     * @param configStorage - Where to store the configuration values to instantiate the store for this pod.
     * @param baseUrl - Base URL of the server.
     * @param configTemplatePath - Where to find the configuration templates.
     */
    constructor(storeFactory, variableHandler, configStorage, baseUrl, configTemplatePath) {
        this.storeFactory = storeFactory;
        this.variableHandler = variableHandler;
        this.configStorage = configStorage;
        this.baseUrl = baseUrl;
        this.configTemplatePath = configTemplatePath ?? DEFAULT_CONFIG_PATH;
    }
    async generate(settings) {
        const identifier = settings.base;
        if (!settings.template) {
            throw new BadRequestHttpError_1.BadRequestHttpError('Settings require template field.');
        }
        if (await this.configStorage.has(identifier.path)) {
            this.logger.warn(`There already is a pod at ${identifier.path}`);
            throw new ConflictHttpError_1.ConflictHttpError(`There already is a pod at ${identifier.path}`);
        }
        await this.variableHandler.handleSafe({ identifier, settings });
        // Filter out irrelevant data in the agent
        const variables = {};
        for (const key of Object.keys(settings)) {
            if ((0, Variables_1.isValidVariable)(key)) {
                variables[key] = settings[key];
            }
        }
        // Prevent unsafe template names
        if (!/^[a-zA-Z0-9.-]+$/u.test(settings.template)) {
            this.logger.warn(`Invalid template name ${settings.template}`);
            throw new BadRequestHttpError_1.BadRequestHttpError(`Invalid template name ${settings.template}`);
        }
        // Storing the template in the variables so it also gets stored in the config for later re-use
        variables[Variables_1.TEMPLATE_VARIABLE.templateConfig] = (0, PathUtil_1.joinFilePath)(this.configTemplatePath, settings.template);
        const store = await this.storeFactory.generate(variables[Variables_1.TEMPLATE_VARIABLE.templateConfig], Variables_1.TEMPLATE.ResourceStore, 
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { ...variables, 'urn:solid-server:default:variable:baseUrl': this.baseUrl });
        this.logger.debug(`Generating store ${identifier.path} with variables ${JSON.stringify(variables)}`);
        // Store the variables permanently
        await this.configStorage.set(identifier.path, variables);
        return store;
    }
}
exports.TemplatedPodGenerator = TemplatedPodGenerator;
//# sourceMappingURL=TemplatedPodGenerator.js.map