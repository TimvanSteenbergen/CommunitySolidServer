import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
import type { InteractionRoute } from '../routing/InteractionRoute';
type OutType = {
    location: string;
    prompt: string;
};
/**
 * Redirects requests based on the OIDC Interaction prompt.
 * Errors in case no match was found.
 *
 * The reason we use this intermediate handler
 * instead of letting the OIDC library redirect directly to the correct page,
 * is because that library creates a cookie with of scope of the target page.
 * By having the library always redirect to the index page,
 * the cookie is relevant for all pages and other pages can see if we are still in an interaction.
 */
export declare class PromptHandler extends JsonInteractionHandler<OutType> {
    private readonly logger;
    private readonly promptRoutes;
    constructor(promptRoutes: Record<string, InteractionRoute>);
    handle({ oidcInteraction }: JsonInteractionHandlerInput): Promise<JsonRepresentation<OutType>>;
}
export {};
