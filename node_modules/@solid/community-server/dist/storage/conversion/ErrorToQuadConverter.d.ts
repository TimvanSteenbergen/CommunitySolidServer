import type { Representation } from '../../http/representation/Representation';
import { BaseTypedRepresentationConverter } from './BaseTypedRepresentationConverter';
import type { RepresentationConverterArgs } from './RepresentationConverter';
/**
 * Converts an error object into quads by creating a triple for each of name/message/stack.
 */
export declare class ErrorToQuadConverter extends BaseTypedRepresentationConverter {
    constructor();
    handle({ identifier, representation }: RepresentationConverterArgs): Promise<Representation>;
}
