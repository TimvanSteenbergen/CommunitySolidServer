import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
/**
 * Cancel an active OIDC interaction.
 */
export declare class CancelOidcHandler extends JsonInteractionHandler<never> {
    handle({ oidcInteraction }: JsonInteractionHandlerInput): Promise<JsonRepresentation<never>>;
}
