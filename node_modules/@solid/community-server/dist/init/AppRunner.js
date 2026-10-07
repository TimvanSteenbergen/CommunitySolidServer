"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRunner = void 0;
const node_fs_1 = require("node:fs");
const componentsjs_1 = require("componentsjs");
const fs_extra_1 = require("fs-extra");
const yargs_1 = __importDefault(require("yargs"));
const LogLevel_1 = require("../logging/LogLevel");
const LogUtil_1 = require("../logging/LogUtil");
const ErrorUtil_1 = require("../util/errors/ErrorUtil");
const InternalServerError_1 = require("../util/errors/InternalServerError");
const PathUtil_1 = require("../util/PathUtil");
const SingleThreaded_1 = require("./cluster/SingleThreaded");
const DEFAULT_CONFIG = (0, PathUtil_1.resolveModulePath)('config/default.json');
const DEFAULT_CLI_RESOLVER = 'urn:solid-server-app-setup:default:CliResolver';
const DEFAULT_APP = 'urn:solid-server:default:App';
const CORE_CLI_PARAMETERS = {
    config: { type: 'array', alias: 'c', default: [DEFAULT_CONFIG], requiresArg: true },
    loggingLevel: { type: 'string', alias: 'l', default: 'info', requiresArg: true, choices: LogLevel_1.LOG_LEVELS },
    mainModulePath: { type: 'string', alias: 'm', requiresArg: true },
};
const ENV_VAR_PREFIX = 'CSS';
/**
 * A class that can be used to instantiate and start a server based on a Component.js configuration.
 */
class AppRunner {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    /**
     * Starts the server with a given config.
     *
     * @param input - All values necessary to configure the server.
     */
    async run(input) {
        const app = await this.create(input);
        await app.start();
    }
    /**
     * Returns an App object, created with the given config, that can start and stop the Solid server.
     *
     * @param input - All values necessary to configure the server.
     */
    async create(input = {}) {
        const loaderProperties = {
            typeChecking: false,
            mainModulePath: '@css:',
            dumpErrorState: false,
            ...input.loaderProperties,
        };
        // Expand mainModulePath as needed
        loaderProperties.mainModulePath = (0, PathUtil_1.resolveAssetPath)(loaderProperties.mainModulePath);
        // Potentially expand config paths as needed
        let configs = input.config ?? ['@css:config/default.json'];
        configs = (Array.isArray(configs) ? configs : [configs]).map(PathUtil_1.resolveAssetPath);
        let componentsManager;
        try {
            componentsManager = await this.createComponentsManager(loaderProperties, configs);
        }
        catch (error) {
            this.resolveError(`Could not build the config files from ${configs.join(',')}`, error);
        }
        const cliResolver = await this.createCliResolver(componentsManager);
        let extracted = {};
        if (input.argv) {
            extracted = await this.extractShorthand(cliResolver.cliExtractor, input.argv);
        }
        const parsedVariables = await this.resolveShorthand(cliResolver.shorthandResolver, {
            ...extracted,
            ...input.shorthand,
        });
        // Create the application using the translated variable values.
        // `variableBindings` override those resolved from the `shorthand` input.
        return this.createApp(componentsManager, { ...parsedVariables, ...input.variableBindings });
    }
    /**
     * Starts the server as a command-line application.
     * Will exit the process on failure.
     *
     * Made non-async to lower the risk of unhandled promise rejections.
     * This is only relevant when this is used to start as a Node.js application on its own,
     * if you use this as part of your code you probably want to use the async version.
     *
     * @param argv - Input parameters.
     * @param argv.argv - Command line arguments.
     * @param argv.stderr - Stream that should be used to output errors before the logger is enabled.
     */
    runCliSync({ argv, stderr = process.stderr }) {
        this.runCli(argv).catch((error) => {
            stderr.write((0, ErrorUtil_1.createErrorMessage)(error));
            // eslint-disable-next-line unicorn/no-process-exit
            process.exit(1);
        });
    }
    /**
     * Starts the server as a command-line application.
     *
     * @param argv - Command line arguments.
     */
    async runCli(argv) {
        const app = await this.createCli(argv);
        try {
            await app.start();
        }
        catch (error) {
            this.logger.error(`Could not start the server: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            this.resolveError('Could not start the server', error);
        }
    }
    /**
     * Returns an App object, created by parsing the Command line arguments, that can start and stop the Solid server.
     * Will exit the process on failure.
     *
     * @param argv - Command line arguments.
     */
    async createCli(argv = process.argv) {
        // Parse only the core CLI arguments needed to load the configuration
        let yargv = (0, yargs_1.default)(argv.slice(2))
            .usage('node ./bin/server.js [args]')
            .options(CORE_CLI_PARAMETERS)
            // We disable help here as it would only show the core parameters
            .help(false)
            // We also read from environment variables
            .env(ENV_VAR_PREFIX);
        const settings = await this.getPackageSettings();
        if (typeof settings !== 'undefined') {
            yargv = yargv.default(settings);
        }
        const params = await yargv.parse();
        const loaderProperties = {
            mainModulePath: params.mainModulePath,
            logLevel: params.loggingLevel,
        };
        return this.create({
            loaderProperties,
            config: params.config,
            argv,
            shorthand: settings,
        });
    }
    /**
     * Retrieves settings from package.json or configuration file when
     * part of an npm project.
     *
     * @returns The settings defined in the configuration file
     */
    async getPackageSettings() {
        // Only try and retrieve config file settings if there is a package.json in the
        // scope of the current directory
        const packageJsonPath = (0, PathUtil_1.joinFilePath)(process.cwd(), 'package.json');
        if (!(0, node_fs_1.existsSync)(packageJsonPath)) {
            return;
        }
        // First see if there is a dedicated .json configuration file
        const cssConfigPath = (0, PathUtil_1.joinFilePath)(process.cwd(), '.community-solid-server.config.json');
        if ((0, node_fs_1.existsSync)(cssConfigPath)) {
            return (0, fs_extra_1.readJSON)(cssConfigPath);
        }
        // Next see if there is a dedicated .js file
        const cssConfigPathJs = (0, PathUtil_1.joinFilePath)(process.cwd(), '.community-solid-server.config.js');
        if ((0, node_fs_1.existsSync)(cssConfigPathJs)) {
            return import(cssConfigPathJs);
        }
        // Finally try to read from the config.community-solid-server
        // field in the root package.json
        const pkg = await (0, fs_extra_1.readJSON)(packageJsonPath);
        if (typeof pkg.config?.['community-solid-server'] === 'object') {
            return pkg.config['community-solid-server'];
        }
    }
    /**
     * Creates the Components Manager that will be used for instantiating.
     */
    async createComponentsManager(loaderProperties, configs) {
        const componentsManager = await componentsjs_1.ComponentsManager.build(loaderProperties);
        for (const config of configs) {
            await componentsManager.configRegistry.register(config);
        }
        return componentsManager;
    }
    /**
     * Instantiates the {@link CliResolver}.
     */
    async createCliResolver(componentsManager) {
        try {
            // Create a CliResolver, which combines a CliExtractor and a VariableResolver
            return await componentsManager.instantiate(DEFAULT_CLI_RESOLVER, {});
        }
        catch (error) {
            this.resolveError(`Could not create the CLI resolver`, error);
        }
    }
    /**
     * Uses the {@link CliExtractor} to convert the CLI args to a {@link Shorthand} object.
     */
    async extractShorthand(cliExtractor, argv) {
        try {
            // Convert CLI args to CLI bindings
            return await cliExtractor.handleSafe(argv);
        }
        catch (error) {
            this.resolveError(`Could not parse the CLI parameters`, error);
        }
    }
    /**
     * Uses the {@link ShorthandResolver} to convert {@link Shorthand} to {@link VariableBindings} .
     */
    async resolveShorthand(shorthandResolver, shorthand) {
        try {
            // Convert CLI bindings into variable bindings
            return await shorthandResolver.handleSafe(shorthand);
        }
        catch (error) {
            this.resolveError(`Could not resolve the shorthand values`, error);
        }
    }
    /**
     * The second Components.js instantiation,
     * where the App is created and started using the variable mappings.
     */
    async createApp(componentsManager, variables) {
        let app;
        // Create the app
        try {
            app = await componentsManager.instantiate(DEFAULT_APP, { variables });
        }
        catch (error) {
            this.resolveError(`Could not create the server`, error);
        }
        // Ensure thread safety
        if (!app.clusterManager.isSingleThreaded()) {
            const violatingClasses = await (0, SingleThreaded_1.listSingleThreadedComponents)(componentsManager);
            if (violatingClasses.length > 0) {
                const verb = violatingClasses.length > 1 ? 'are' : 'is';
                const detailedError = new InternalServerError_1.InternalServerError(`[${violatingClasses.join(', ')}] ${verb} not threadsafe and should not be run in multithreaded setups!`);
                this.resolveError('Cannot run a singlethreaded-only component in a multithreaded setup!', detailedError);
            }
        }
        return app;
    }
    /**
     * Throws a new error that provides additional information through the extra message.
     * Also appends the stack trace to the message.
     * This is needed for errors that are thrown before the logger is created as we can't log those the standard way.
     */
    resolveError(message, error) {
        const errorMessage = `${message}\n${(0, ErrorUtil_1.isError)(error) ? error.stack : (0, ErrorUtil_1.createErrorMessage)(error)}\n`;
        throw new Error(errorMessage);
    }
}
exports.AppRunner = AppRunner;
//# sourceMappingURL=AppRunner.js.map