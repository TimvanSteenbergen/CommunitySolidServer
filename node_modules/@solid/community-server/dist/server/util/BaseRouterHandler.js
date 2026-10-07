"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouterHandler = void 0;
const MethodNotAllowedHttpError_1 = require("../../util/errors/MethodNotAllowedHttpError");
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const AsyncHandler_1 = require("../../util/handlers/AsyncHandler");
const PathUtil_1 = require("../../util/PathUtil");
/**
 * Checks if a given method and path are satisfied and allows its handler to be executed if so.
 *
 * Implementations of this class should call `canHandleInput` in their `canHandle` call with the correct parameters.
 *
 * `canHandleInput` expects a ResourceIdentifier to indicate it expects the target to have been validated already.
 */
class BaseRouterHandler extends AsyncHandler_1.AsyncHandler {
    baseUrlLength;
    handler;
    allowedMethods;
    allMethods;
    allowedPathNamesRegEx;
    constructor(args) {
        super();
        if (typeof args.allowedPathNames !== 'undefined' && typeof args.baseUrl !== 'string') {
            throw new TypeError('A value for allowedPathNames requires baseUrl to be defined.');
        }
        // Trimming trailing slash so regexes can start with `/`
        this.baseUrlLength = (0, PathUtil_1.trimTrailingSlashes)(args.baseUrl ?? '').length;
        this.handler = args.handler;
        this.allowedMethods = args.allowedMethods ?? ['*'];
        this.allMethods = this.allowedMethods.includes('*');
        this.allowedPathNamesRegEx = (args.allowedPathNames ?? ['.*']).map((pn) => new RegExp(pn, 'u'));
    }
    async canHandleInput(input, method, target) {
        if (!this.allMethods && !this.allowedMethods.includes(method)) {
            throw new MethodNotAllowedHttpError_1.MethodNotAllowedHttpError([method], `${method} is not allowed.`);
        }
        const pathName = target.path.slice(this.baseUrlLength);
        if (!this.allowedPathNamesRegEx.some((regex) => regex.test(pathName))) {
            throw new NotFoundHttpError_1.NotFoundHttpError(`Cannot handle route ${pathName}`);
        }
        await this.handler.canHandle(input);
    }
    async handle(input) {
        return this.handler.handle(input);
    }
}
exports.BaseRouterHandler = BaseRouterHandler;
//# sourceMappingURL=BaseRouterHandler.js.map