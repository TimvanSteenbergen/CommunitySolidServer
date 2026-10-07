"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUrlRouterRule = void 0;
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const RouterRule_1 = require("./RouterRule");
/**
 * Routes requests based on their base url.
 * Checks if any of the stored base URLs match the request identifier.
 * If there are no matches the base store will be returned if one was configured.
 *
 * Part of the dynamic pod creation.
 * Uses the identifiers that were added to the routing storage.
 *
 * @see {@link TemplatedPodGenerator}, {@link ConfigPodInitializer}, {@link ConfigPodManager}
 */
class BaseUrlRouterRule extends RouterRule_1.RouterRule {
    baseStore;
    stores;
    constructor(stores, baseStore) {
        super();
        this.baseStore = baseStore;
        this.stores = stores;
    }
    async handle({ identifier }) {
        try {
            return await this.findStore(identifier);
        }
        catch (error) {
            if (this.baseStore) {
                return this.baseStore;
            }
            throw error;
        }
    }
    /**
     * Finds the store whose base url key is contained in the given identifier.
     */
    async findStore(identifier) {
        for await (const [key, store] of this.stores.entries()) {
            if (identifier.path.startsWith(key)) {
                return store;
            }
        }
        throw new NotFoundHttpError_1.NotFoundHttpError();
    }
}
exports.BaseUrlRouterRule = BaseUrlRouterRule;
//# sourceMappingURL=BaseUrlRouterRule.js.map