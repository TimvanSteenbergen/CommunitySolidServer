"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePodIdRoute = void 0;
const IdInteractionRoute_1 = require("../routing/IdInteractionRoute");
/**
 * Implementation of an {@link PodIdRoute} that adds the identifier relative to a base {@link AccountIdRoute}.
 */
class BasePodIdRoute extends IdInteractionRoute_1.IdInteractionRoute {
    constructor(base) {
        super(base, 'podId');
    }
}
exports.BasePodIdRoute = BasePodIdRoute;
//# sourceMappingURL=PodIdRoute.js.map