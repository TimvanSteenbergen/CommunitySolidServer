import type { Representation } from '../../http/representation/Representation';
import { RepresentationConverter } from './RepresentationConverter';
import type { RepresentationConverterArgs } from './RepresentationConverter';
/**
 * A {@link RepresentationConverter} that does not perform any conversion.
 */
export declare class PassthroughConverter extends RepresentationConverter {
    handle({ representation }: RepresentationConverterArgs): Promise<Representation>;
}
