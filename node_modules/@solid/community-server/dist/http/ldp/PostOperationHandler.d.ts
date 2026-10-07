import type { ResourceStore } from '../../storage/ResourceStore';
import type { ResponseDescription } from '../output/response/ResponseDescription';
import type { OperationHandlerInput } from './OperationHandler';
import { OperationHandler } from './OperationHandler';
/**
 * Handles POST {@link Operation}s.
 * Calls the addResource function from a {@link ResourceStore}.
 */
export declare class PostOperationHandler extends OperationHandler {
    protected readonly logger: import("../..").Logger;
    private readonly store;
    constructor(store: ResourceStore);
    canHandle({ operation }: OperationHandlerInput): Promise<void>;
    handle({ operation }: OperationHandlerInput): Promise<ResponseDescription>;
}
