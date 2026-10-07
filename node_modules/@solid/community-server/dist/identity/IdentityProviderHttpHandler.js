"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityProviderHttpHandler = void 0;
const OkResponseDescription_1 = require("../http/output/response/OkResponseDescription");
const LogUtil_1 = require("../logging/LogUtil");
const OperationHttpHandler_1 = require("../server/OperationHttpHandler");
const ErrorUtil_1 = require("../util/errors/ErrorUtil");
const Vocabularies_1 = require("../util/Vocabularies");
/**
 * Generates the active Interaction object if there is an ongoing OIDC interaction.
 * Finds the account ID if there is cookie metadata.
 *
 * Calls the stored {@link InteractionHandler} with that information and returns the result.
 */
class IdentityProviderHttpHandler extends OperationHttpHandler_1.OperationHttpHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    providerFactory;
    cookieStore;
    handler;
    constructor(args) {
        super();
        this.providerFactory = args.providerFactory;
        this.cookieStore = args.cookieStore;
        this.handler = args.handler;
    }
    async handle({ operation, request, response }) {
        // This being defined means we're in an OIDC session
        let oidcInteraction;
        try {
            const provider = await this.providerFactory.getProvider();
            oidcInteraction = await provider.interactionDetails(request, response);
            this.logger.debug('Found an active OIDC interaction.');
        }
        catch (error) {
            this.logger.debug(`No active OIDC interaction found: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
        }
        // Determine account
        let accountId;
        const cookie = operation.body.metadata.get(Vocabularies_1.SOLID_HTTP.terms.accountCookie)?.value;
        if (cookie) {
            accountId = await this.cookieStore.get(cookie);
        }
        const representation = await this.handler.handleSafe({ operation, oidcInteraction, accountId });
        return new OkResponseDescription_1.OkResponseDescription(representation.metadata, representation.data);
    }
}
exports.IdentityProviderHttpHandler = IdentityProviderHttpHandler;
//# sourceMappingURL=IdentityProviderHttpHandler.js.map