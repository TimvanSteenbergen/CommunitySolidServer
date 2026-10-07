import type { Representation } from '../../http/representation/Representation';
import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { ResourceStore } from '../ResourceStore';
import { RouterRule } from './RouterRule';
/**
 * Utility class to easily configure Regex to ResourceStore mappings in the config files.
 */
export declare class RegexRule {
    readonly regex: RegExp;
    readonly store: ResourceStore;
    constructor(regex: string, store: ResourceStore);
}
/**
 * Routes requests to a store based on the path of the identifier.
 * The identifier will be stripped of the base URI after which regexes will be used to find the correct store.
 * The trailing slash of the base URI will still be present so the first character a regex can match would be that `/`.
 * This way regexes such as `/container/` can match containers in any position.
 *
 * In case none of the regexes match an error will be thrown.
 */
export declare class RegexRouterRule extends RouterRule {
    private readonly base;
    private readonly rules;
    /**
     * The keys of the `storeMap` will be converted into actual RegExp objects that will be used for testing.
     */
    constructor(base: string, rules: RegexRule[]);
    canHandle(input: {
        identifier: ResourceIdentifier;
        representation?: Representation;
    }): Promise<void>;
    handle(input: {
        identifier: ResourceIdentifier;
    }): Promise<ResourceStore>;
    /**
     * Finds the store corresponding to the regex that matches the given identifier.
     * Throws an error if none is found.
     */
    private matchStore;
    /**
     * Strips the base of the identifier and throws an error if there is no overlap.
     */
    private toRelative;
}
