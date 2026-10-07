import type { ResponseDescription } from '../../http/output/response/ResponseDescription';
import type { RepresentationConverter } from '../../storage/conversion/RepresentationConverter';
import type { OperationHttpHandlerInput } from '../OperationHttpHandler';
import { OperationHttpHandler } from '../OperationHttpHandler';
/**
 * An {@link OperationHttpHandler} that converts the response of its handler based on the {@link Operation} preferences.
 * If there are no preferences, or no data, the response will be returned as-is.
 */
export declare class ConvertingOperationHttpHandler extends OperationHttpHandler {
    private readonly converter;
    private readonly operationHandler;
    constructor(converter: RepresentationConverter, operationHandler: OperationHttpHandler);
    canHandle(input: OperationHttpHandlerInput): Promise<void>;
    handle(input: OperationHttpHandlerInput): Promise<ResponseDescription>;
}
