import type { ProviderFactory } from '../../configuration/ProviderFactory';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
/**
 * Handles the OIDC consent prompts where the user confirms they want to log in for the given client.
 */
export declare class ConsentHandler extends JsonInteractionHandler<never> {
    private readonly providerFactory;
    constructor(providerFactory: ProviderFactory);
    handle({ oidcInteraction, json }: JsonInteractionHandlerInput): Promise<never>;
    /**
     * Either returns the grant associated with the given interaction or creates a new one if it does not exist yet.
     */
    private getGrant;
    /**
     * Updates the grant with all the missing scopes and claims requested by the interaction.
     *
     * Will reject the `offline_access` scope if `remember` is false.
     */
    private updateGrant;
    /**
     * Updates the interaction with the new grant and returns the resulting redirect URL.
     */
    private updateInteraction;
}
