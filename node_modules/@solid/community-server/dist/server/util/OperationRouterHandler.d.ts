import type { OperationHttpHandler, OperationHttpHandlerInput } from '../OperationHttpHandler';
import type { BaseRouterHandlerArgs } from './BaseRouterHandler';
import { BaseRouterHandler } from './BaseRouterHandler';
/**
 * A {@link BaseRouterHandler} for an {@link OperationHttpHandler}.
 */
export declare class OperationRouterHandler extends BaseRouterHandler<OperationHttpHandler> {
    constructor(args: BaseRouterHandlerArgs<OperationHttpHandler>);
    canHandle(input: OperationHttpHandlerInput): Promise<void>;
}
