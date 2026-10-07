"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingResourceStore = void 0;
const NotFoundHttpError_1 = require("../util/errors/NotFoundHttpError");
const NotImplementedHttpError_1 = require("../util/errors/NotImplementedHttpError");
/**
 * Store that routes the incoming request to a specific store based on the stored ResourceRouter.
 * In case no store was found for one of the functions that take no data (GET/PATCH/DELETE),
 * a 404 will be thrown. In the other cases the error of the router will be thrown (which would probably be 400).
 */
class RoutingResourceStore {
    rule;
    constructor(rule) {
        this.rule = rule;
    }
    async hasResource(identifier) {
        return (await this.getStore(identifier)).hasResource(identifier);
    }
    async getRepresentation(identifier, preferences, conditions) {
        return (await this.getStore(identifier)).getRepresentation(identifier, preferences, conditions);
    }
    async addResource(container, representation, conditions) {
        return (await this.getStore(container, representation)).addResource(container, representation, conditions);
    }
    async setRepresentation(identifier, representation, conditions) {
        return (await this.getStore(identifier, representation)).setRepresentation(identifier, representation, conditions);
    }
    async deleteResource(identifier, conditions) {
        return (await this.getStore(identifier)).deleteResource(identifier, conditions);
    }
    async modifyResource(identifier, patch, conditions) {
        return (await this.getStore(identifier)).modifyResource(identifier, patch, conditions);
    }
    async getStore(identifier, representation) {
        if (representation) {
            return this.rule.handleSafe({ identifier, representation });
        }
        // In case there is no incoming data we want to return 404 if no store was found
        try {
            return await this.rule.handleSafe({ identifier });
        }
        catch (error) {
            if (NotImplementedHttpError_1.NotImplementedHttpError.isInstance(error)) {
                throw new NotFoundHttpError_1.NotFoundHttpError('', { cause: error });
            }
            throw error;
        }
    }
}
exports.RoutingResourceStore = RoutingResourceStore;
//# sourceMappingURL=RoutingResourceStore.js.map