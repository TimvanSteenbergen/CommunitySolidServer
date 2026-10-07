"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOwnerHandler = void 0;
const yup_1 = require("yup");
const AccountUtil_1 = require("../account/util/AccountUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
const YupUtil_1 = require("../YupUtil");
const inSchema = (0, yup_1.object)({
    webId: (0, yup_1.string)().trim().required(),
    visible: (0, yup_1.boolean)().optional().default(false),
    // If true: remove the WebID as owner
    remove: (0, yup_1.boolean)().optional().default(false),
});
/**
 * Responsible for adding/updating/deleting owners in pods.
 */
class UpdateOwnerHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    podStore;
    podRoute;
    constructor(podStore, podRoute) {
        super();
        this.podStore = podStore;
        this.podRoute = podRoute;
    }
    async getView({ accountId, target }) {
        const pod = await this.findVerifiedPod(target, accountId);
        const owners = await this.podStore.getOwners(pod.id);
        return { json: { ...(0, YupUtil_1.parseSchema)(inSchema), baseUrl: pod?.baseUrl, owners } };
    }
    async handle(input) {
        const { accountId, target, json } = input;
        const { webId, visible, remove } = await (0, YupUtil_1.validateWithError)(inSchema, json);
        const pod = await this.findVerifiedPod(target, accountId);
        if (remove) {
            await this.podStore.removeOwner(pod.id, webId);
        }
        else {
            await this.podStore.updateOwner(pod.id, webId, visible);
        }
        return { json: {} };
    }
    /**
     * Extract the pod ID from the path and find the associated pod.
     * Asserts that the given account ID is the creator of this pod.
     */
    async findVerifiedPod(target, accountId) {
        const { podId } = (0, AccountUtil_1.parsePath)(this.podRoute, target.path);
        const pod = await this.podStore.get(podId);
        (0, AccountUtil_1.verifyAccountId)(accountId, pod?.accountId);
        return { id: podId, ...pod };
    }
}
exports.UpdateOwnerHandler = UpdateOwnerHandler;
//# sourceMappingURL=UpdateOwnerHandler.js.map