"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalizableHandler = void 0;
const Finalizer_1 = require("./Finalizer");
/**
 * Allows using a Finalizable as a Finalizer Handler.
 */
class FinalizableHandler extends Finalizer_1.Finalizer {
    finalizable;
    constructor(finalizable) {
        super();
        this.finalizable = finalizable;
    }
    async handle() {
        return this.finalizable.finalize();
    }
}
exports.FinalizableHandler = FinalizableHandler;
//# sourceMappingURL=FinalizableHandler.js.map