import type { ProviderFactory } from '../../configuration/ProviderFactory';
import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
type OutType = {
    client: Record<string, string | string[] | undefined>;
    webId?: string;
};
/**
 * Returns a JSON representation with metadata of the client that is requesting the OIDC interaction.
 */
export declare class ClientInfoHandler extends JsonInteractionHandler<OutType> {
    private readonly providerFactory;
    constructor(providerFactory: ProviderFactory);
    handle({ oidcInteraction }: JsonInteractionHandlerInput): Promise<JsonRepresentation<OutType>>;
}
export {};
