import type { Representation } from '../http/representation/Representation';
import type { RepresentationPreferences } from '../http/representation/RepresentationPreferences';
import type { ResourceIdentifier } from '../http/representation/ResourceIdentifier';
import type { Conditions } from './conditions/Conditions';
import { PassthroughStore } from './PassthroughStore';
import type { ResourceStore } from './ResourceStore';
/**
 * Allow containers to have a custom representation.
 * The index representation will be returned when the following conditions are fulfilled:
 *  * The request targets a container.
 *  * A resource with the given `indexName` exists in the container. (default: "index.html")
 *  * The highest weighted preference matches the `mediaRange` (default: "text/html")
 * Otherwise the request will be passed on to the source store.
 * In case the index representation should always be returned when it exists,
 * the `mediaRange` should be set to "\*∕\*".
 *
 * Note: this functionality is not yet part of the specification. Relevant issues are:
 * - https://github.com/solid/specification/issues/69
 * - https://github.com/solid/specification/issues/198
 * - https://github.com/solid/specification/issues/109
 * - https://github.com/solid/web-access-control-spec/issues/36
 */
export declare class IndexRepresentationStore extends PassthroughStore {
    private readonly indexName;
    private readonly mediaRange;
    constructor(source: ResourceStore, indexName?: string, mediaRange?: string);
    getRepresentation(identifier: ResourceIdentifier, preferences: RepresentationPreferences, conditions?: Conditions): Promise<Representation>;
    /**
     * Makes sure the stored media range explicitly matches the highest weight preference.
     */
    private matchesPreferences;
}
