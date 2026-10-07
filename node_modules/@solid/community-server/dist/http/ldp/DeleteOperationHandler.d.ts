import type { ResourceStore } from '../../storage/ResourceStore';
import type { ResponseDescription } from '../output/response/ResponseDescription';
import type { OperationHandlerInput } from './OperationHandler';
import { OperationHandler } from './OperationHandler';
/**
 * Handles DELETE {@link Operation}s.
 * Calls the deleteResource function from a {@link ResourceStore}.
 */
export declare class DeleteOperationHandler extends OperationHandler {
    private readonly store;
    constructor(store: ResourceStore);
    canHandle({ operation }: OperationHandlerInput): Promise<void>;
    handle({ operation }: OperationHandlerInput): Promise<ResponseDescription>;
}
