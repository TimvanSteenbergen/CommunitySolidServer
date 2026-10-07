"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayUnionHandler = void 0;
const UnionHandler_1 = require("./UnionHandler");
/**
 * A utility handler that concatenates the results of all its handlers into a single result.
 */
class ArrayUnionHandler extends UnionHandler_1.UnionHandler {
    constructor(handlers, requireAll, ignoreErrors) {
        super(handlers, requireAll, ignoreErrors);
    }
    async combine(results) {
        return results.flat();
    }
}
exports.ArrayUnionHandler = ArrayUnionHandler;
//# sourceMappingURL=ArrayUnionHandler.js.map