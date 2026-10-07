import type { ProviderFactory } from '../../configuration/ProviderFactory';
import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
import type { JsonView } from '../JsonView';
import type { WebIdStore } from '../webid/util/WebIdStore';
/**
 * Allows users to choose which WebID they want to authenticate as during an OIDC interaction.
 *
 * One of the main reason picking a WebID is a separate class/request from consenting to the OIDC interaction,
 * is because the OIDC-provider will only give the information we need for consent
 * once we have added an accountId to the OIDC interaction, which we do in this class.
 * The library also really wants to use that accountId as the value that you use for generating the tokens,
 * meaning we can't just use another value there, so we need to assign the WebID to it,
 * unless we use a hacky workaround.
 */
export declare class PickWebIdHandler extends JsonInteractionHandler<never> implements JsonView {
    private readonly logger;
    private readonly webIdStore;
    private readonly providerFactory;
    constructor(webIdStore: WebIdStore, providerFactory: ProviderFactory);
    getView({ accountId }: JsonInteractionHandlerInput): Promise<JsonRepresentation>;
    handle({ oidcInteraction, accountId, json }: JsonInteractionHandlerInput): Promise<never>;
}
