"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertingRouterRule = void 0;
const RouterRule_1 = require("./RouterRule");
/**
 * Rule that directs requests based on how the data would need to be converted.
 * In case the given converter can convert the data to the requested type,
 * it will be directed to the `convertStore`.
 * Otherwise the `defaultStore` will be chosen.
 *
 * In case there is no data and only an identifier the `defaultStore` will be checked
 * if it contains the given identifier.
 * If not, the `convertStore` will be returned.
 */
class ConvertingRouterRule extends RouterRule_1.RouterRule {
    typedStores;
    defaultStore;
    constructor(typedStores, defaultStore) {
        super();
        this.typedStores = typedStores;
        this.defaultStore = defaultStore;
    }
    async handle(input) {
        const { identifier, representation } = input;
        let store;
        if (representation) {
            // TS type checking is not smart enough to let us reuse the input object
            store = await this.findStore(async (entry) => entry.supportChecker.supports({ identifier, representation }));
        }
        else {
            // No content-type given so we can only check if one of the stores has data for the identifier
            store = await this.findStore(async (entry) => entry.store.hasResource(identifier));
        }
        return store;
    }
    /**
     * Helper function that runs the given callback function for all the stores
     * and returns the first one that does not throw an error.
     *
     * Returns the default store if no match was found.
     */
    async findStore(supports) {
        // Try all the stores, return default if there is no match
        for (const entry of this.typedStores) {
            if (await supports(entry)) {
                return entry.store;
            }
        }
        return this.defaultStore;
    }
}
exports.ConvertingRouterRule = ConvertingRouterRule;
//# sourceMappingURL=ConvertingRouterRule.js.map