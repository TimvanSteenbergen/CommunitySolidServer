"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAccountIdRoute = exports.ACCOUNT_ID_KEY = void 0;
const IdInteractionRoute_1 = require("../routing/IdInteractionRoute");
exports.ACCOUNT_ID_KEY = 'accountId';
/**
 * Implementation of an {@link AccountIdRoute} that adds the identifier relative to a base {@link InteractionRoute}.
 */
class BaseAccountIdRoute extends IdInteractionRoute_1.IdInteractionRoute {
    constructor(base) {
        super(base, 'accountId');
    }
}
exports.BaseAccountIdRoute = BaseAccountIdRoute;
//# sourceMappingURL=AccountIdRoute.js.map