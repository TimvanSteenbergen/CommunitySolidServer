import type { AccountStore } from './account/util/AccountStore';
import type { CookieStore } from './account/util/CookieStore';
import type { JsonRepresentation } from './InteractionUtil';
import type { JsonInteractionHandlerInput } from './JsonInteractionHandler';
import { JsonInteractionHandler } from './JsonInteractionHandler';
/**
 * Handles all the necessary steps for having cookies.
 * Refreshes the cookie expiration if there was a successful account interaction.
 * Adds the cookie and cookie expiration data to the output metadata,
 * unless it is already present in that metadata.
 * Checks the account settings to see if the cookie needs to be remembered.
 */
export declare class CookieInteractionHandler extends JsonInteractionHandler {
    private readonly source;
    private readonly accountStore;
    private readonly cookieStore;
    constructor(source: JsonInteractionHandler, accountStore: AccountStore, cookieStore: CookieStore);
    canHandle(input: JsonInteractionHandlerInput): Promise<void>;
    handle(input: JsonInteractionHandlerInput): Promise<JsonRepresentation>;
}
