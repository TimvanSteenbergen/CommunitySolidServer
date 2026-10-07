"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountInitializer = void 0;
const Initializer_1 = require("../init/Initializer");
const LogUtil_1 = require("../logging/LogUtil");
/**
 * Initializes an account with email/password login and a pod with the provided name.
 */
class AccountInitializer extends Initializer_1.Initializer {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    accountStore;
    passwordStore;
    podCreator;
    email;
    password;
    name;
    constructor(args) {
        super();
        this.accountStore = args.accountStore;
        this.passwordStore = args.passwordStore;
        this.podCreator = args.podCreator;
        this.email = args.email;
        this.password = args.password;
        this.name = args.name;
    }
    async handle() {
        this.logger.info(`Creating account for ${this.email}`);
        const accountId = await this.accountStore.create();
        const id = await this.passwordStore.create(this.email, accountId, this.password);
        await this.passwordStore.confirmVerification(id);
        this.logger.info(`Creating pod ${this.name ? `with name ${this.name}` : 'at the root'}`);
        await this.podCreator.handleSafe({ accountId, name: this.name });
        // Not really necessary but don't want to keep passwords in memory if not required
        delete this.email;
        delete this.password;
    }
}
exports.AccountInitializer = AccountInitializer;
//# sourceMappingURL=AccountInitializer.js.map