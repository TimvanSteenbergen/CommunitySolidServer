import type { EmptyObject } from '../../../util/map/MapUtil';
import type { CookieStore } from '../account/util/CookieStore';
import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
/**
 * Responsible for logging a user out.
 * In practice this means making sure the cookie is no longer valid.
 */
export declare class LogoutHandler extends JsonInteractionHandler<EmptyObject> {
    private readonly cookieStore;
    constructor(cookieStore: CookieStore);
    handle(input: JsonInteractionHandlerInput): Promise<JsonRepresentation<EmptyObject>>;
}
