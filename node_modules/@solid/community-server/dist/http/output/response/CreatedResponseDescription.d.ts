import type { ResourceIdentifier } from '../../representation/ResourceIdentifier';
import { ResponseDescription } from './ResponseDescription';
/**
 * Corresponds to a 201 response, containing the relevant location metadata.
 */
export declare class CreatedResponseDescription extends ResponseDescription {
    constructor(location: ResourceIdentifier);
}
