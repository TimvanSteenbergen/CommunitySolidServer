import type { EmptyObject } from '../../../util/map/MapUtil';
import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
import type { WebIdStore } from './util/WebIdStore';
import type { WebIdLinkRoute } from './WebIdLinkRoute';
/**
 * Allows users to remove WebIDs linked to their account.
 */
export declare class UnlinkWebIdHandler extends JsonInteractionHandler<EmptyObject> {
    private readonly webIdStore;
    private readonly webIdRoute;
    constructor(webIdStore: WebIdStore, webIdRoute: WebIdLinkRoute);
    handle({ target, accountId }: JsonInteractionHandlerInput): Promise<JsonRepresentation<EmptyObject>>;
}
