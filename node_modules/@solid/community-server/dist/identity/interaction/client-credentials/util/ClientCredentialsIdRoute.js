"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClientCredentialsIdRoute = void 0;
const IdInteractionRoute_1 = require("../../routing/IdInteractionRoute");
/**
 * Implementation of an {@link ClientCredentialsIdRoute}
 * that adds the identifier relative to a base {@link AccountIdRoute}.
 */
class BaseClientCredentialsIdRoute extends IdInteractionRoute_1.IdInteractionRoute {
    constructor(base) {
        super(base, 'clientCredentialsId');
    }
}
exports.BaseClientCredentialsIdRoute = BaseClientCredentialsIdRoute;
//# sourceMappingURL=ClientCredentialsIdRoute.js.map