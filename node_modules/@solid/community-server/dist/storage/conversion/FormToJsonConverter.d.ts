import type { Representation } from '../../http/representation/Representation';
import { BaseTypedRepresentationConverter } from './BaseTypedRepresentationConverter';
import type { RepresentationConverterArgs } from './RepresentationConverter';
/**
 * Converts application/x-www-form-urlencoded data to application/json.
 * Due to the nature of form data, the result will be a simple key/value JSON object.
 */
export declare class FormToJsonConverter extends BaseTypedRepresentationConverter {
    constructor();
    handle({ representation }: RepresentationConverterArgs): Promise<Representation>;
}
