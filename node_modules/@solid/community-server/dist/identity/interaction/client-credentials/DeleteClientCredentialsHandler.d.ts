import type { EmptyObject } from '../../../util/map/MapUtil';
import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
import type { ClientCredentialsIdRoute } from './util/ClientCredentialsIdRoute';
import type { ClientCredentialsStore } from './util/ClientCredentialsStore';
/**
 * Handles the deletion of client credentials tokens.
 */
export declare class DeleteClientCredentialsHandler extends JsonInteractionHandler<EmptyObject> {
    private readonly clientCredentialsStore;
    private readonly clientCredentialsRoute;
    constructor(clientCredentialsStore: ClientCredentialsStore, clientCredentialsRoute: ClientCredentialsIdRoute);
    handle({ target, accountId }: JsonInteractionHandlerInput): Promise<JsonRepresentation<EmptyObject>>;
}
