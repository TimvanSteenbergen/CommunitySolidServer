"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePodCreator = void 0;
const LogUtil_1 = require("../../../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../../../util/errors/BadRequestHttpError");
const PathUtil_1 = require("../../../../util/PathUtil");
const PodCreator_1 = require("./PodCreator");
/**
 * Handles the creation of pods.
 * Will call the stored {@link PodStore} with the provided settings.
 */
class BasePodCreator extends PodCreator_1.PodCreator {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    baseUrl;
    identifierGenerator;
    relativeWebIdPath;
    webIdStore;
    podStore;
    constructor(args) {
        super();
        this.baseUrl = args.baseUrl;
        this.identifierGenerator = args.identifierGenerator;
        this.relativeWebIdPath = args.relativeWebIdPath;
        this.webIdStore = args.webIdStore;
        this.podStore = args.podStore;
    }
    async handle(input) {
        const baseIdentifier = this.generateBaseIdentifier(input.name);
        // Either the input WebID or the one generated in the pod
        const webId = input.webId ?? (0, PathUtil_1.joinUrl)(baseIdentifier.path, this.relativeWebIdPath);
        const podSettings = {
            ...input.settings,
            base: baseIdentifier,
            webId,
        };
        // Link the WebID to the account immediately if no WebID was provided as this is expected behaviour.
        // We do this first as we can't undo creating the pod if this would fail.
        // If an external WebID is the owner we do not want to link it to the account automatically
        const webIdLink = await this.handleWebId(!input.webId, webId, input.accountId, podSettings);
        // Create the pod
        const podId = await this.createPod(input.accountId, podSettings, !input.name, webIdLink);
        return {
            podUrl: baseIdentifier.path,
            webId,
            podId,
            webIdLink,
        };
    }
    generateBaseIdentifier(name) {
        if (name) {
            return this.identifierGenerator.generate(name);
        }
        return { path: this.baseUrl };
    }
    /**
     * Links the WebID to the account if `linkWebId` is true.
     * Also updates the `oidcIssuer` value in the settings object in that case.
     */
    async handleWebId(linkWebId, webId, accountId, settings) {
        if (linkWebId) {
            // It is important that this check happens here.
            // Otherwise, if the account already has this WebID link,
            // this link would be deleted if pod creation fails,
            // since we clean up the WebID link again afterwards.
            // Current implementation of the {@link WebIdStore} also has this check but better safe than sorry.
            if (await this.webIdStore.isLinked(webId, accountId)) {
                this.logger.warn('Trying to create pod which would generate a WebID that is already linked to this account');
                throw new BadRequestHttpError_1.BadRequestHttpError(`${webId} is already registered to this account.`);
            }
            // Need to have the necessary `solid:oidcIssuer` triple if the WebID is linked
            settings.oidcIssuer = this.baseUrl;
            return this.webIdStore.create(webId, accountId);
        }
    }
    /**
     * Creates a pod with the given settings.
     * In case pod creation fails, the given WebID link will be removed, if there is one, before throwing an error.
     */
    async createPod(accountId, settings, overwrite, webIdLink) {
        try {
            return await this.podStore.create(accountId, settings, overwrite);
        }
        catch (error) {
            // Undo the WebID linking if pod creation fails
            if (webIdLink) {
                await this.webIdStore.delete(webIdLink);
            }
            throw error;
        }
    }
}
exports.BasePodCreator = BasePodCreator;
//# sourceMappingURL=BasePodCreator.js.map