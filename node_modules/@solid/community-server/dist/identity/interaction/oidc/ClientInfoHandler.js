"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientInfoHandler = void 0;
const InteractionUtil_1 = require("../InteractionUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
// Only extract specific fields to prevent leaking information
// Based on https://www.w3.org/ns/solid/oidc-context.jsonld
const CLIENT_KEYS = [
    'client_id',
    'client_uri',
    'logo_uri',
    'policy_uri',
    'client_name',
    'contacts',
    'grant_types',
    'scope',
];
/**
 * Returns a JSON representation with metadata of the client that is requesting the OIDC interaction.
 */
class ClientInfoHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    providerFactory;
    constructor(providerFactory) {
        super();
        this.providerFactory = providerFactory;
    }
    async handle({ oidcInteraction }) {
        (0, InteractionUtil_1.assertOidcInteraction)(oidcInteraction);
        const provider = await this.providerFactory.getProvider();
        const client = await provider.Client.find(oidcInteraction.params.client_id);
        const metadata = client?.metadata() ?? {};
        const jsonLd = Object.fromEntries(CLIENT_KEYS.filter((key) => key in metadata)
            .map((key) => [key, metadata[key]]));
        jsonLd['@context'] = 'https://www.w3.org/ns/solid/oidc-context.jsonld';
        // Note: this is the `accountId` from the OIDC library, in which we store the WebID
        const webId = oidcInteraction?.session?.accountId;
        return { json: { client: jsonLd, webId } };
    }
}
exports.ClientInfoHandler = ClientInfoHandler;
//# sourceMappingURL=ClientInfoHandler.js.map