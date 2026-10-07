import { BasicRepresentation } from '../http/representation/BasicRepresentation';
import type { Representation } from '../http/representation/Representation';
import { RepresentationMetadata } from '../http/representation/RepresentationMetadata';
import type { Conditions } from '../storage/conditions/Conditions';
import type { ETagHandler } from '../storage/conditions/ETagHandler';
/**
 * Helper function to generate type quads for a Container or Resource.
 *
 * @param metadata - Metadata to add to.
 * @param isContainer - If the identifier corresponds to a container.
 */
export declare function addResourceMetadata(metadata: RepresentationMetadata, isContainer: boolean): void;
/**
 * Updates the dc:modified time to the given time.
 *
 * @param metadata - Metadata to update.
 * @param date - Last modified date. Defaults to current time.
 */
export declare function updateModifiedDate(metadata: RepresentationMetadata, date?: Date): void;
/**
 * Links a template file with a given content-type to the metadata using the SOLID_META.template predicate.
 *
 * @param metadata - Metadata to update.
 * @param templateFile - Path to the template.
 * @param contentType - Content-type of the template after it is rendered.
 */
export declare function addTemplateMetadata(metadata: RepresentationMetadata, templateFile: string, contentType: string): void;
/**
 * Helper function to clone a representation, the original representation can still be used.
 * This function loads the entire stream in memory.
 *
 * @param representation - The representation to clone.
 *
 * @returns The cloned representation.
 */
export declare function cloneRepresentation(representation: Representation): Promise<BasicRepresentation>;
/**
 * Verify whether the given {@link Representation} matches the given conditions.
 * If true, add the corresponding ETag to the body metadata.
 * If not, destroy the data stream and throw a {@link NotModifiedHttpError} with the same ETag.
 * If `conditions` is not defined, nothing will happen.
 *
 * This uses the strict conditions check which takes the content type into account;
 * therefore, this should only be called after content negotiation, when it is certain what the output will be.
 *
 * Note that browsers only keep track of one ETag, and the Vary header has no impact on this,
 * meaning the browser could send us the ETag for a Turtle resource even though it is requesting JSON-LD;
 * this is why we have to check ETags after content negotiation.
 *
 * @param body - The representation to compare the conditions against.
 * @param eTagHandler - Used to generate the ETag to return with the 304 response.
 * @param conditions - The conditions to assert.
 */
export declare function assertReadConditions(body: Representation, eTagHandler: ETagHandler, conditions?: Conditions): void;
