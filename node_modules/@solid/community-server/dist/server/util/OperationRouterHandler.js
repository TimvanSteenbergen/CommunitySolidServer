"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationRouterHandler = void 0;
const BaseRouterHandler_1 = require("./BaseRouterHandler");
/**
 * A {@link BaseRouterHandler} for an {@link OperationHttpHandler}.
 */
class OperationRouterHandler extends BaseRouterHandler_1.BaseRouterHandler {
    constructor(args) {
        super(args);
    }
    async canHandle(input) {
        await super.canHandleInput(input, input.operation.method, input.operation.target);
    }
}
exports.OperationRouterHandler = OperationRouterHandler;
//# sourceMappingURL=OperationRouterHandler.js.map