"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlHandler = void 0;
const AccountIdRoute_1 = require("./account/AccountIdRoute");
const JsonInteractionHandler_1 = require("./JsonInteractionHandler");
/**
 * Creates an object with the keys matching those of the input `controls`,
 * and the values being the results received by the matching values in the same input.
 *
 * If `source` is defined, the controls will be added to the output of that handler after passing the input.
 * In case the control keys conflict with a key already present in the resulting object,
 * the results will be merged.
 */
class ControlHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    controls;
    source;
    constructor(controls, source) {
        super();
        this.controls = controls;
        this.source = source;
    }
    async canHandle(input) {
        await this.source?.canHandle(input);
    }
    async handle(input) {
        const result = await this.source?.handle(input);
        const controls = await this.generateControls(input);
        const json = this.mergeControls(result?.json, controls);
        return {
            json,
            metadata: result?.metadata,
        };
    }
    isRoute(value) {
        return Boolean(value.getPath);
    }
    /**
     * Generate the controls for all the stored keys.
     */
    async generateControls(input) {
        let controls = {};
        for (const [key, value] of Object.entries(this.controls)) {
            const controlSet = await this.generateControlSet(input, value);
            if (controlSet) {
                controls = this.mergeControls(controls, { [key]: controlSet });
            }
        }
        return controls;
    }
    async generateControlSet(input, value) {
        if (this.isRoute(value)) {
            try {
                return value.getPath({ [AccountIdRoute_1.ACCOUNT_ID_KEY]: input.accountId });
            }
            catch {
                // Path required an account ID which is missing
                return;
            }
        }
        const { json } = await value.handleSafe(input);
        if (Array.isArray(json) && json.length === 0) {
            return;
        }
        if (typeof json === 'object' && Object.keys(json).length === 0) {
            return;
        }
        return json;
    }
    /**
     * Merge the two objects.
     * Generally this will probably not be necessary, or be very simple merges,
     * but this ensures that we handle all possibilities.
     */
    mergeControls(original, controls) {
        if (typeof original === 'undefined') {
            return controls;
        }
        if (typeof controls === 'undefined') {
            return original;
        }
        if (typeof original !== 'object' || typeof controls !== 'object') {
            return original;
        }
        if (Array.isArray(original)) {
            if (Array.isArray(controls)) {
                return [...original, ...controls];
            }
            return original;
        }
        if (Array.isArray(controls)) {
            return original;
        }
        const result = {};
        for (const key of new Set([...Object.keys(original), ...Object.keys(controls)])) {
            result[key] = this.mergeControls(original[key], controls[key]);
        }
        return result;
    }
}
exports.ControlHandler = ControlHandler;
//# sourceMappingURL=ControlHandler.js.map