import type { Representation } from '../../http/representation/Representation';
import { BaseTypedRepresentationConverter } from './BaseTypedRepresentationConverter';
import type { RepresentationConverterArgs } from './RepresentationConverter';
/**
 * Converts an Error object to JSON by copying its fields.
 */
export declare class ErrorToJsonConverter extends BaseTypedRepresentationConverter {
    constructor();
    handle({ representation }: RepresentationConverterArgs): Promise<Representation>;
    private errorToJson;
}
