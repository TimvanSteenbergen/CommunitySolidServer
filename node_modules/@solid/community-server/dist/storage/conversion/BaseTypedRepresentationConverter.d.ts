import type { ValuePreferences } from '../../http/representation/RepresentationPreferences';
import type { PromiseOrValue } from '../../util/PromiseUtil';
import type { RepresentationConverterArgs } from './RepresentationConverter';
import { TypedRepresentationConverter } from './TypedRepresentationConverter';
type ValuePreferencesArg = PromiseOrValue<string> | PromiseOrValue<string[]> | PromiseOrValue<ValuePreferences>;
/**
 * A base {@link TypedRepresentationConverter} implementation for converters
 * that can convert from all its input types to all its output types.
 *
 * This base class handles the `canHandle` call by comparing the input content type to the stored input types
 * and the output preferences to the stored output types.
 *
 * Output weights are determined by multiplying all stored output weights with the weight of the input type.
 */
export declare abstract class BaseTypedRepresentationConverter extends TypedRepresentationConverter {
    protected inputTypes: Promise<ValuePreferences>;
    protected outputTypes: Promise<ValuePreferences>;
    constructor(inputTypes: ValuePreferencesArg, outputTypes: ValuePreferencesArg);
    /**
     * Matches all inputs to all outputs.
     */
    getOutputTypes(contentType: string): Promise<ValuePreferences>;
    /**
     * Determines whether the given conversion request is supported,
     * given the available content type conversions:
     *  - Checks if there is a content type for the input.
     *  - Checks if the input type is supported by the parser.
     *  - Checks if the parser can produce one of the preferred output types.
     * Throws an error with details if conversion is not possible.
     */
    canHandle(args: RepresentationConverterArgs): Promise<void>;
}
export {};
