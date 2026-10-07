import type { Representation } from '../../http/representation/Representation';
import { RepresentationConverter } from './RepresentationConverter';
import type { RepresentationConverterArgs } from './RepresentationConverter';
/**
 * Extra options for the ConstantConverter.
 */
export interface ConstantConverterOptions {
    /**
     * Whether this should trigger on containers.
     */
    container?: boolean;
    /**
     * Whether this should trigger on documents.
     */
    document?: boolean;
    /**
     * The minimum requested quality/preference before this should trigger.
     */
    minQuality?: number;
    /**
     * Media ranges for which the conversion should happen.
     */
    enabledMediaRanges?: string[];
    /**
     * Media ranges for which the conversion should not happen.
     */
    disabledMediaRanges?: string[];
}
/**
 * A {@link RepresentationConverter} that ensures
 * a representation for a certain content type is available.
 *
 * Representations of the same content type are served as is;
 * others are replaced by a constant document.
 *
 * This can for example be used to serve an index.html file,
 * which could then interactively load another representation.
 *
 * Options default to the most permissive values when not defined.
 */
export declare class ConstantConverter extends RepresentationConverter {
    private readonly logger;
    private readonly filePath;
    private readonly contentType;
    private readonly options;
    /**
     * Creates a new constant converter.
     *
     * @param filePath - The path to the constant representation.
     * @param contentType - The content type of the constant representation.
     * @param options - Extra options for the converter.
     */
    constructor(filePath: string, contentType: string, options?: ConstantConverterOptions);
    canHandle({ identifier, preferences, representation }: RepresentationConverterArgs): Promise<void>;
    handle({ representation }: RepresentationConverterArgs): Promise<Representation>;
}
