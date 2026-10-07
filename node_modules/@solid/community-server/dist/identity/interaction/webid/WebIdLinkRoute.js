"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWebIdLinkRoute = void 0;
const IdInteractionRoute_1 = require("../routing/IdInteractionRoute");
/**
 * Implementation of an {@link WebIdLinkRoute} that adds the identifier relative to a base {@link AccountIdRoute}.
 */
class BaseWebIdLinkRoute extends IdInteractionRoute_1.IdInteractionRoute {
    constructor(base) {
        super(base, 'webIdLink');
    }
}
exports.BaseWebIdLinkRoute = BaseWebIdLinkRoute;
//# sourceMappingURL=WebIdLinkRoute.js.map