import type { RepresentationConverter } from '../../storage/conversion/RepresentationConverter';
import type { Representation } from '../representation/Representation';
import type { ValidatorInput } from './Validator';
import { Validator } from './Validator';
/**
 * Validates a Representation by verifying if the data stream contains valid RDF data.
 * It does this by letting the stored RepresentationConverter convert the data.
 */
export declare class RdfValidator extends Validator {
    protected readonly converter: RepresentationConverter;
    constructor(converter: RepresentationConverter);
    handle({ representation, identifier }: ValidatorInput): Promise<Representation>;
}
