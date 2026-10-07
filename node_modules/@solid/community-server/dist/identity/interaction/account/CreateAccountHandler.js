"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountHandler = void 0;
const ResolveLoginHandler_1 = require("../login/ResolveLoginHandler");
/**
 * Creates new accounts using an {@link AccountStore};
 */
class CreateAccountHandler extends ResolveLoginHandler_1.ResolveLoginHandler {
    constructor(accountStore, cookieStore) {
        super(accountStore, cookieStore);
    }
    async getView() {
        return { json: {} };
    }
    async login() {
        const accountId = await this.accountStore.create();
        return { json: { accountId } };
    }
}
exports.CreateAccountHandler = CreateAccountHandler;
//# sourceMappingURL=CreateAccountHandler.js.map