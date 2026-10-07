"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockingInteractionHandler = void 0;
const InteractionHandler_1 = require("./InteractionHandler");
const READ_METHODS = new Set(['OPTIONS', 'HEAD', 'GET']);
/**
 * An {@link InteractionHandler} that locks the path generated with the stored route during an operation.
 * If the route is the base account route, this can be used to prevent multiple operations on the same account.
 */
class LockingInteractionHandler extends InteractionHandler_1.InteractionHandler {
    locker;
    accountRoute;
    source;
    constructor(locker, accountRoute, source) {
        super();
        this.locker = locker;
        this.accountRoute = accountRoute;
        this.source = source;
    }
    async canHandle(input) {
        return this.source.canHandle(input);
    }
    async handle(input) {
        const { accountId, operation } = input;
        // No lock if there is no account
        if (!accountId) {
            return this.source.handle(input);
        }
        const identifier = { path: this.accountRoute.getPath({ accountId }) };
        if (READ_METHODS.has(operation.method)) {
            return this.locker.withReadLock(identifier, async () => this.source.handle(input));
        }
        return this.locker.withWriteLock(identifier, async () => this.source.handle(input));
    }
}
exports.LockingInteractionHandler = LockingInteractionHandler;
//# sourceMappingURL=LockingInteractionHandler.js.map