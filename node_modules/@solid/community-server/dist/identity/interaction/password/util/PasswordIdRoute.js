"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePasswordIdRoute = void 0;
const IdInteractionRoute_1 = require("../../routing/IdInteractionRoute");
/**
 * Implementation of an {@link PasswordIdRoute} that adds the identifier relative to a base {@link AccountIdRoute}.
 */
class BasePasswordIdRoute extends IdInteractionRoute_1.IdInteractionRoute {
    constructor(base) {
        super(base, 'passwordId');
    }
}
exports.BasePasswordIdRoute = BasePasswordIdRoute;
//# sourceMappingURL=PasswordIdRoute.js.map