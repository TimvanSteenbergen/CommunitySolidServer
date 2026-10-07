import type { Representation } from '../../http/representation/Representation';
import { BaseTypedRepresentationConverter } from './BaseTypedRepresentationConverter';
import type { RepresentationConverterArgs } from './RepresentationConverter';
/**
 * Converts `internal/quads` to most major RDF serializations.
 */
export declare class QuadToRdfConverter extends BaseTypedRepresentationConverter {
    private readonly outputPreferences?;
    constructor(options?: {
        outputPreferences?: Record<string, number>;
    });
    handle({ identifier, representation: quads, preferences }: RepresentationConverterArgs): Promise<Representation>;
}
