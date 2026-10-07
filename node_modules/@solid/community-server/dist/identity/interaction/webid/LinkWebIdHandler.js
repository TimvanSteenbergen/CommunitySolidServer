"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkWebIdHandler = void 0;
const yup_1 = require("yup");
const LogUtil_1 = require("../../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../../util/errors/BadRequestHttpError");
const AccountUtil_1 = require("../account/util/AccountUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
const YupUtil_1 = require("../YupUtil");
const inSchema = (0, yup_1.object)({
    webId: YupUtil_1.URL_SCHEMA.required(),
});
/**
 * Handles the linking of WebIDs to account,
 * thereby registering them to the server IDP.
 */
class LinkWebIdHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    baseUrl;
    ownershipValidator;
    podStore;
    webIdStore;
    webIdRoute;
    storageStrategy;
    constructor(args) {
        super();
        this.baseUrl = args.baseUrl;
        this.ownershipValidator = args.ownershipValidator;
        this.podStore = args.podStore;
        this.webIdStore = args.webIdStore;
        this.webIdRoute = args.webIdRoute;
        this.storageStrategy = args.storageStrategy;
    }
    async getView({ accountId }) {
        (0, AccountUtil_1.assertAccountId)(accountId);
        const webIdLinks = {};
        for (const { id, webId } of await this.webIdStore.findLinks(accountId)) {
            webIdLinks[webId] = this.webIdRoute.getPath({ accountId, webIdLink: id });
        }
        return { json: { ...(0, YupUtil_1.parseSchema)(inSchema), webIdLinks } };
    }
    async handle({ accountId, json }) {
        (0, AccountUtil_1.assertAccountId)(accountId);
        const { webId } = await (0, YupUtil_1.validateWithError)(inSchema, json);
        if (await this.webIdStore.isLinked(webId, accountId)) {
            this.logger.warn(`Trying to link WebID ${webId} to account ${accountId} which already has this link`);
            throw new BadRequestHttpError_1.BadRequestHttpError(`${webId} is already registered to this account.`);
        }
        // Only need to check ownership if the account did not create the pod
        let isCreator = false;
        try {
            const baseUrl = await this.storageStrategy.getStorageIdentifier({ path: webId });
            const pod = await this.podStore.findByBaseUrl(baseUrl.path);
            isCreator = accountId === pod?.accountId;
        }
        catch {
            // Probably a WebID not hosted on the server
        }
        if (!isCreator) {
            await this.ownershipValidator.handleSafe({ webId });
        }
        const webIdLink = await this.webIdStore.create(webId, accountId);
        const resource = this.webIdRoute.getPath({ accountId, webIdLink });
        return { json: { resource, webId, oidcIssuer: this.baseUrl } };
    }
}
exports.LinkWebIdHandler = LinkWebIdHandler;
//# sourceMappingURL=LinkWebIdHandler.js.map