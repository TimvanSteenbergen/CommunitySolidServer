import { Validator } from '../../http/auxiliary/Validator';
import type { ValidatorInput } from '../../http/auxiliary/Validator';
import type { Representation } from '../../http/representation/Representation';
import type { QuotaStrategy } from '../quota/QuotaStrategy';
/**
 * The QuotaValidator validates data streams by making sure they would not exceed the limits of a QuotaStrategy.
 */
export declare class QuotaValidator extends Validator {
    private readonly strategy;
    constructor(strategy: QuotaStrategy);
    handle({ representation, identifier }: ValidatorInput): Promise<Representation>;
}
