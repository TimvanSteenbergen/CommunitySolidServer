import type { RepresentationConverter } from '../../../storage/conversion/RepresentationConverter';
import type { PreferenceParser } from '../../input/preferences/PreferenceParser';
import type { ResponseDescription } from '../response/ResponseDescription';
import type { ErrorHandlerArgs } from './ErrorHandler';
import { ErrorHandler } from './ErrorHandler';
/**
 * Converts an error into a Representation of content type internal/error.
 * Then feeds that representation into its converter to create a representation based on the given preferences.
 */
export declare class ConvertingErrorHandler extends ErrorHandler {
    private readonly converter;
    private readonly preferenceParser;
    private readonly showStackTrace;
    constructor(converter: RepresentationConverter, preferenceParser: PreferenceParser, showStackTrace?: boolean);
    canHandle(input: ErrorHandlerArgs): Promise<void>;
    handle(input: ErrorHandlerArgs): Promise<ResponseDescription>;
    handleSafe(input: ErrorHandlerArgs): Promise<ResponseDescription>;
    /**
     * Prepares the arguments used by all functions.
     */
    private extractErrorDetails;
    /**
     * Creates a ResponseDescription based on the Representation.
     */
    private createResponse;
}
