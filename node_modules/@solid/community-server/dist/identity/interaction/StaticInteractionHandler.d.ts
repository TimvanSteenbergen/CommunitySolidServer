import type { Json } from '../../util/Json';
import type { JsonRepresentation } from './InteractionUtil';
import { JsonInteractionHandler } from './JsonInteractionHandler';
/**
 * An {@link JsonInteractionHandler} that always returns the same JSON response on all requests.
 */
export declare class StaticInteractionHandler extends JsonInteractionHandler {
    private readonly response;
    /**
     * @param response - @range {json}
     */
    constructor(response: Record<string, Json>);
    handle(): Promise<JsonRepresentation>;
}
