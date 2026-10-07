import type { ComponentsJsFactory } from './ComponentsJsFactory';
/**
 * Can be used to instantiate objects using Components.js.
 * Default main module path is the root folder of the project.
 * For every generate call a new manager will be made,
 * but moduleState will be stored in between calls.
 */
export declare class BaseComponentsJsFactory implements ComponentsJsFactory {
    private readonly options;
    constructor(relativeModulePath?: string, logLevel?: string);
    private buildManager;
    /**
     * Calls Components.js to instantiate a new object.
     *
     * @param configPath - Location of the config to instantiate.
     * @param componentIri - Iri of the object in the config that will be the result.
     * @param variables - Variables to send to Components.js
     *
     * @returns The resulting object, corresponding to the given component IRI.
     */
    generate<T>(configPath: string, componentIri: string, variables: Record<string, unknown>): Promise<T>;
}
