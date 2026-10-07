"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodFilterHandler = void 0;
const NotImplementedHttpError_1 = require("../errors/NotImplementedHttpError");
const AsyncHandler_1 = require("./AsyncHandler");
/**
 * Only accepts requests where the input has a (possibly nested) `method` field
 * that matches any one of the given methods.
 * In case of a match, the input will be sent to the source handler.
 */
class MethodFilterHandler extends AsyncHandler_1.AsyncHandler {
    methods;
    source;
    constructor(methods, source) {
        super();
        this.methods = methods;
        this.source = source;
    }
    async canHandle(input) {
        const method = this.findMethod(input);
        if (!this.methods.includes(method)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Cannot determine permissions of ${method}, only ${this.methods.join(',')}.`);
        }
        await this.source.canHandle(input);
    }
    async handle(input) {
        return this.source.handle(input);
    }
    /**
     * Finds the correct method in the input object.
     */
    findMethod(input) {
        if ('method' in input) {
            return input.method;
        }
        if ('request' in input) {
            return this.findMethod(input.request);
        }
        if ('operation' in input) {
            return this.findMethod(input.operation);
        }
        throw new NotImplementedHttpError_1.NotImplementedHttpError('Could not find method in input object.');
    }
}
exports.MethodFilterHandler = MethodFilterHandler;
//# sourceMappingURL=MethodFilterHandler.js.map