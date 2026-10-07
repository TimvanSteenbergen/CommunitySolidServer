"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAccountStore = exports.ACCOUNT_STORAGE_DESCRIPTION = void 0;
const AccountStore_1 = require("./AccountStore");
const GenericAccountStore_1 = require("./GenericAccountStore");
exports.ACCOUNT_STORAGE_DESCRIPTION = {
    [AccountStore_1.ACCOUNT_SETTINGS_REMEMBER_LOGIN]: 'boolean?',
};
/**
 * A {@link GenericAccountStore} that supports the minimal account settings.
 * Needs to be initialized before it can be used.
 */
class BaseAccountStore extends GenericAccountStore_1.GenericAccountStore {
    // Wrong typings to prevent Components.js typing issues
    constructor(storage) {
        super(storage, exports.ACCOUNT_STORAGE_DESCRIPTION);
    }
}
exports.BaseAccountStore = BaseAccountStore;
//# sourceMappingURL=BaseAccountStore.js.map