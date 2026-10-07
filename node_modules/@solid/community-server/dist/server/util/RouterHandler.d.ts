import type { TargetExtractor } from '../../http/input/identifier/TargetExtractor';
import type { HttpHandler, HttpHandlerInput } from '../HttpHandler';
import { BaseRouterHandler } from './BaseRouterHandler';
import type { BaseRouterHandlerArgs } from './BaseRouterHandler';
export interface RouterHandlerArgs extends BaseRouterHandlerArgs<HttpHandler> {
    targetExtractor: TargetExtractor;
}
/**
 * A {@link BaseRouterHandler} for an {@link HttpHandler}.
 * Uses a {@link TargetExtractor} to generate the target identifier.
 */
export declare class RouterHandler extends BaseRouterHandler<HttpHandler> {
    private readonly targetExtractor;
    constructor(args: RouterHandlerArgs);
    canHandle(input: HttpHandlerInput): Promise<void>;
}
