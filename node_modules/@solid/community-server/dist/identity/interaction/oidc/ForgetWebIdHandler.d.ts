import type { ProviderFactory } from '../../configuration/ProviderFactory';
import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
/**
 * Forgets the chosen WebID in an OIDC interaction,
 * causing the next policy trigger to be one where a new WebID has to be chosen.
 */
export declare class ForgetWebIdHandler extends JsonInteractionHandler<never> {
    private readonly providerFactory;
    constructor(providerFactory: ProviderFactory);
    handle({ oidcInteraction }: JsonInteractionHandlerInput): Promise<JsonRepresentation<never>>;
}
