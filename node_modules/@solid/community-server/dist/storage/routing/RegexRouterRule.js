"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexRouterRule = exports.RegexRule = void 0;
const BadRequestHttpError_1 = require("../../util/errors/BadRequestHttpError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const RouterRule_1 = require("./RouterRule");
/**
 * Utility class to easily configure Regex to ResourceStore mappings in the config files.
 */
class RegexRule {
    regex;
    store;
    constructor(regex, store) {
        this.regex = new RegExp(regex, 'u');
        this.store = store;
    }
}
exports.RegexRule = RegexRule;
/**
 * Routes requests to a store based on the path of the identifier.
 * The identifier will be stripped of the base URI after which regexes will be used to find the correct store.
 * The trailing slash of the base URI will still be present so the first character a regex can match would be that `/`.
 * This way regexes such as `/container/` can match containers in any position.
 *
 * In case none of the regexes match an error will be thrown.
 */
class RegexRouterRule extends RouterRule_1.RouterRule {
    base;
    rules;
    /**
     * The keys of the `storeMap` will be converted into actual RegExp objects that will be used for testing.
     */
    constructor(base, rules) {
        super();
        this.base = (0, PathUtil_1.trimTrailingSlashes)(base);
        this.rules = rules;
    }
    async canHandle(input) {
        this.matchStore(input.identifier);
    }
    async handle(input) {
        return this.matchStore(input.identifier);
    }
    /**
     * Finds the store corresponding to the regex that matches the given identifier.
     * Throws an error if none is found.
     */
    matchStore(identifier) {
        const path = this.toRelative(identifier);
        for (const { regex, store } of this.rules) {
            if (regex.test(path)) {
                return store;
            }
        }
        throw new NotImplementedHttpError_1.NotImplementedHttpError(`No stored regexes match ${identifier.path}`);
    }
    /**
     * Strips the base of the identifier and throws an error if there is no overlap.
     */
    toRelative(identifier) {
        if (!identifier.path.startsWith(this.base)) {
            throw new BadRequestHttpError_1.BadRequestHttpError(`Identifiers need to start with ${this.base}`);
        }
        return identifier.path.slice(this.base.length);
    }
}
exports.RegexRouterRule = RegexRouterRule;
//# sourceMappingURL=RegexRouterRule.js.map