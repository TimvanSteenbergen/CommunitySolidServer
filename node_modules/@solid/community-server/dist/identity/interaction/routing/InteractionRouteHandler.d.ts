import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
import type { InteractionRoute } from './InteractionRoute';
/**
 * InteractionHandler that only accepts input of which the target matches the stored route.
 *
 * Rejects operations that target a different route,
 * otherwise the input parameters are passed to the source handler.
 */
export declare class InteractionRouteHandler<T extends InteractionRoute<string>> extends JsonInteractionHandler {
    protected readonly route: T;
    protected readonly source: JsonInteractionHandler;
    constructor(route: T, source: JsonInteractionHandler);
    canHandle(input: JsonInteractionHandlerInput): Promise<void>;
    handle(input: JsonInteractionHandlerInput): Promise<JsonRepresentation>;
}
