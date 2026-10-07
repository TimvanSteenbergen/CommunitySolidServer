import type { Arguments, Options } from 'yargs';
import { CliExtractor } from './CliExtractor';
export type YargsOptions = Options;
/**
 * This class exists as wrapper around a yargs Options object,
 * thereby allowing us to create these in a Components.js configuration.
 *
 * Format details can be found at https://yargs.js.org/docs/#api-reference-optionskey-opt
 */
export declare class YargsParameter {
    readonly name: string;
    readonly options: YargsOptions;
    /**
     * @param name - Name of the parameter. Corresponds to the first parameter passed to the `yargs.options` function.
     * @param options - Options for a single parameter that should be parsed. @range {json}
     */
    constructor(name: string, options: Record<string, unknown>);
}
export interface CliOptions {
    usage?: string;
    strictMode?: boolean;
    loadFromEnv?: boolean;
    envVarPrefix?: string;
}
/**
 * Parses CLI args using the yargs library.
 * Specific settings can be enabled through the provided options.
 */
export declare class YargsCliExtractor extends CliExtractor {
    protected readonly yargsArgOptions: Record<string, YargsOptions>;
    protected readonly yargvOptions: CliOptions;
    /**
     * @param parameters - Parameters that should be parsed from the CLI.
     * @param options - Additional options to configure yargs. @range {json}
     *
     * JSON parameters cannot be optional due to https://github.com/LinkedSoftwareDependencies/Components-Generator.js/issues/87
     */
    constructor(parameters: YargsParameter[], options: CliOptions);
    handle(argv: readonly string[]): Promise<Arguments>;
    /**
     * Creates the yargs Argv object based on the input CLI argv.
     */
    private createYArgv;
}
