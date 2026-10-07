import type { JsonRepresentation } from './InteractionUtil';
import type { JsonInteractionHandlerInput } from './JsonInteractionHandler';
import { JsonInteractionHandler } from './JsonInteractionHandler';
import type { JsonView } from './JsonView';
/**
 * Utility class for the common case of a {@link JsonInteractionHandler}
 * describing the expected input on a GET request which is needed to do a POST request.
 *
 * Returns the result of a {@link JsonView} on GET requests.
 * POST requests are sent to the {@link JsonInteractionHandler}.
 * Other methods will be rejected.
 */
export declare class ViewInteractionHandler extends JsonInteractionHandler {
    private readonly source;
    constructor(source: JsonInteractionHandler & JsonView);
    canHandle(input: JsonInteractionHandlerInput): Promise<void>;
    handle(input: JsonInteractionHandlerInput): Promise<JsonRepresentation>;
}
