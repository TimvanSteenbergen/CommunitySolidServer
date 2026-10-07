"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePodHandler = void 0;
const yup_1 = require("yup");
const LogUtil_1 = require("../../../logging/LogUtil");
const AccountUtil_1 = require("../account/util/AccountUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
const YupUtil_1 = require("../YupUtil");
const inSchema = (0, yup_1.object)({
    name: (0, yup_1.string)().trim().min(1).optional(),
    settings: (0, yup_1.object)({
        webId: YupUtil_1.URL_SCHEMA,
    }).optional(),
});
/**
 * Handles the creation of pods.
 * Will call the stored {@link PodCreator} with the settings found in the input JSON.
 */
class CreatePodHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    podStore;
    podCreator;
    webIdLinkRoute;
    podIdRoute;
    inSchema;
    constructor(podStore, podCreator, webIdLinkRoute, podIdRoute, allowRoot = false) {
        super();
        this.podStore = podStore;
        this.podCreator = podCreator;
        this.webIdLinkRoute = webIdLinkRoute;
        this.podIdRoute = podIdRoute;
        this.inSchema = inSchema.clone();
        if (!allowRoot) {
            // Casting is necessary to prevent errors
            this.inSchema.fields.name = this.inSchema.fields.name.required();
        }
    }
    async getView({ accountId }) {
        (0, AccountUtil_1.assertAccountId)(accountId);
        const pods = {};
        for (const { id, baseUrl } of await this.podStore.findPods(accountId)) {
            pods[baseUrl] = this.podIdRoute.getPath({ accountId, podId: id });
        }
        return { json: { ...(0, YupUtil_1.parseSchema)(this.inSchema), pods } };
    }
    async handle({ json, accountId }) {
        // In case the class was not initialized with allowRoot: false, missing name values will result in an error
        const { name, settings } = await (0, YupUtil_1.validateWithError)(inSchema, json);
        (0, AccountUtil_1.assertAccountId)(accountId);
        const result = await this.podCreator.handleSafe({
            accountId,
            webId: settings?.webId,
            name,
            settings,
        });
        const webIdResource = result.webIdLink && this.webIdLinkRoute.getPath({ accountId, webIdLink: result.webIdLink });
        const podResource = this.podIdRoute.getPath({ accountId, podId: result.podId });
        return { json: { pod: result.podUrl, webId: result.webId, podResource, webIdResource } };
    }
}
exports.CreatePodHandler = CreatePodHandler;
//# sourceMappingURL=CreatePodHandler.js.map