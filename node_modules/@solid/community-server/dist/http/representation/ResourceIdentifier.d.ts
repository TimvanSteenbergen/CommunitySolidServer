/**
 * The unique identifier of a resource.
 */
export interface ResourceIdentifier {
    /**
     * Path to the relevant resource.
     */
    path: string;
}
/**
 * Determines whether the object is a {@link ResourceIdentifier}.
 */
export declare function isResourceIdentifier(object: unknown): object is ResourceIdentifier;
