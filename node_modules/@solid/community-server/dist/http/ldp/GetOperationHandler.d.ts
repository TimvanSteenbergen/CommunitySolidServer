import type { ETagHandler } from '../../storage/conditions/ETagHandler';
import type { ResourceStore } from '../../storage/ResourceStore';
import type { ResponseDescription } from '../output/response/ResponseDescription';
import type { OperationHandlerInput } from './OperationHandler';
import { OperationHandler } from './OperationHandler';
/**
 * Handles GET {@link Operation}s.
 * Calls the getRepresentation function from a {@link ResourceStore}.
 */
export declare class GetOperationHandler extends OperationHandler {
    private readonly store;
    private readonly eTagHandler;
    constructor(store: ResourceStore, eTagHandler: ETagHandler);
    canHandle({ operation }: OperationHandlerInput): Promise<void>;
    handle({ operation }: OperationHandlerInput): Promise<ResponseDescription>;
}
