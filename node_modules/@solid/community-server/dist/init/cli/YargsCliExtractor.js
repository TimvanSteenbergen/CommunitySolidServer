"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YargsCliExtractor = exports.YargsParameter = void 0;
const yargs_1 = __importDefault(require("yargs"));
const CliExtractor_1 = require("./CliExtractor");
/**
 * This class exists as wrapper around a yargs Options object,
 * thereby allowing us to create these in a Components.js configuration.
 *
 * Format details can be found at https://yargs.js.org/docs/#api-reference-optionskey-opt
 */
class YargsParameter {
    name;
    options;
    /**
     * @param name - Name of the parameter. Corresponds to the first parameter passed to the `yargs.options` function.
     * @param options - Options for a single parameter that should be parsed. @range {json}
     */
    constructor(name, options) {
        this.name = name;
        this.options = options;
    }
}
exports.YargsParameter = YargsParameter;
/**
 * Parses CLI args using the yargs library.
 * Specific settings can be enabled through the provided options.
 */
class YargsCliExtractor extends CliExtractor_1.CliExtractor {
    yargsArgOptions;
    yargvOptions;
    /**
     * @param parameters - Parameters that should be parsed from the CLI.
     * @param options - Additional options to configure yargs. @range {json}
     *
     * JSON parameters cannot be optional due to https://github.com/LinkedSoftwareDependencies/Components-Generator.js/issues/87
     */
    constructor(parameters, options) {
        super();
        this.yargsArgOptions = Object.fromEntries(parameters.map((entry) => [entry.name, entry.options]));
        this.yargvOptions = { ...options };
    }
    async handle(argv) {
        return this.createYArgv(argv).parse();
    }
    /**
     * Creates the yargs Argv object based on the input CLI argv.
     */
    createYArgv(argv) {
        let yArgv = (0, yargs_1.default)(argv.slice(2));
        // Error and show help message when multiple values were provided
        // for a non Array type parameter
        yArgv.check((args) => {
            for (const [name, options] of Object.entries(this.yargsArgOptions)) {
                if (options.type !== 'array' && Array.isArray(args[name])) {
                    throw new Error(`Multiple values for --${name} (-${options.alias}) were provided where only one is allowed`);
                }
            }
            return true;
        });
        if (this.yargvOptions.usage !== undefined) {
            yArgv = yArgv.usage(this.yargvOptions.usage);
        }
        if (this.yargvOptions.strictMode) {
            yArgv = yArgv.strict();
        }
        if (this.yargvOptions.loadFromEnv) {
            yArgv = yArgv.env(this.yargvOptions.envVarPrefix ?? '');
        }
        return yArgv.options(this.yargsArgOptions);
    }
}
exports.YargsCliExtractor = YargsCliExtractor;
//# sourceMappingURL=YargsCliExtractor.js.map