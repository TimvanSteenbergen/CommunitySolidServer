import type { Representation } from '../../http/representation/Representation';
import type { TemplateEngine } from '../../util/templates/TemplateEngine';
import type { InteractionHandlerInput } from './InteractionHandler';
import { InteractionHandler } from './InteractionHandler';
import type { InteractionRoute } from './routing/InteractionRoute';
/**
 * Used to link file paths and URLs together.
 * The reason we use a separate object instead of a key/value Record,
 * is that this makes it easier to override the values in Components.js,
 * which can be useful if someone wants to replace the HTML for certain URLs.
 */
export declare class HtmlViewEntry {
    readonly route: InteractionRoute;
    readonly filePath: string;
    constructor(route: InteractionRoute, filePath: string);
}
/**
 * Stores the HTML templates associated with specific InteractionRoutes.
 *
 * This class will only handle GET operations for which there is a matching template,
 * if HTML is more preferred than JSON.
 * The reason for doing it like this instead of a standard content negotiation flow,
 * is because we only want to return the HTML pages on GET requests.
 *
 * Templates will receive the parameter `idpIndex` in their context pointing to the root index URL of the IDP API
 * and an `authenticating` parameter indicating if this is an active OIDC interaction.
 */
export declare class HtmlViewHandler extends InteractionHandler {
    private readonly idpIndex;
    private readonly templateEngine;
    private readonly templates;
    constructor(index: InteractionRoute, templateEngine: TemplateEngine, templates: HtmlViewEntry[]);
    canHandle({ operation }: InteractionHandlerInput): Promise<void>;
    handle({ operation, oidcInteraction }: InteractionHandlerInput): Promise<Representation>;
    /**
     * Finds the template for the given URL.
     */
    private findTemplate;
}
