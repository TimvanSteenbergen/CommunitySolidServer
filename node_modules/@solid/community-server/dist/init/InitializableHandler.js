"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializableHandler = void 0;
const Initializer_1 = require("./Initializer");
/**
 * Allows using an Initializable as an Initializer Handler.
 */
class InitializableHandler extends Initializer_1.Initializer {
    initializable;
    constructor(initializable) {
        super();
        this.initializable = initializable;
    }
    async handle() {
        return this.initializable.initialize();
    }
}
exports.InitializableHandler = InitializableHandler;
//# sourceMappingURL=InitializableHandler.js.map