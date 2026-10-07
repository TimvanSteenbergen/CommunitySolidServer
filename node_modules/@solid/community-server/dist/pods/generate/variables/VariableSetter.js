"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableSetter = void 0;
const VariableHandler_1 = require("./VariableHandler");
/**
 * A VariableHandler that will set the given variable to the given value,
 * unless there already is a value for the variable and override is false.
 */
class VariableSetter extends VariableHandler_1.VariableHandler {
    variable;
    value;
    override;
    constructor(variable, value, override = false) {
        super();
        this.variable = variable;
        this.value = value;
        this.override = override;
    }
    async handle({ settings }) {
        if (this.override || !settings[this.variable]) {
            settings[this.variable] = this.value;
        }
    }
}
exports.VariableSetter = VariableSetter;
//# sourceMappingURL=VariableSetter.js.map