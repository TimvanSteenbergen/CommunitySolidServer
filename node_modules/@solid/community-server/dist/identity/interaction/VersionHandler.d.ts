import type { JsonRepresentation } from './InteractionUtil';
import type { JsonInteractionHandlerInput } from './JsonInteractionHandler';
import { JsonInteractionHandler } from './JsonInteractionHandler';
/**
 * Adds the current version of the API to the JSON output.
 * This version number should be updated every time the API changes.
 */
export declare class VersionHandler extends JsonInteractionHandler {
    private readonly source;
    constructor(source: JsonInteractionHandler);
    canHandle(input: JsonInteractionHandlerInput): Promise<void>;
    handle(input: JsonInteractionHandlerInput): Promise<JsonRepresentation>;
}
