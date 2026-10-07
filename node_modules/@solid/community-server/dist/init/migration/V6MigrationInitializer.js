"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V6MigrationInitializer = void 0;
const node_readline_1 = require("node:readline");
const LoginStorage_1 = require("../../identity/interaction/account/util/LoginStorage");
const BaseClientCredentialsStore_1 = require("../../identity/interaction/client-credentials/util/BaseClientCredentialsStore");
const BasePasswordStore_1 = require("../../identity/interaction/password/util/BasePasswordStore");
const BasePodStore_1 = require("../../identity/interaction/pod/util/BasePodStore");
const BaseWebIdStore_1 = require("../../identity/interaction/webid/util/BaseWebIdStore");
const LogUtil_1 = require("../../logging/LogUtil");
const Initializer_1 = require("../Initializer");
/**
 * Handles migrating account data from v6 to the newer format.
 * Will only trigger if it is detected that this server was previously started on an older version
 * and at least one account was found.
 * Confirmation will be asked to the user through a CLI prompt.
 * After migration is complete the old data will be removed.
 */
class V6MigrationInitializer extends Initializer_1.Initializer {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    skipConfirmation;
    versionKey;
    setupStorage;
    accountStorage;
    clientCredentialsStorage;
    cleanupStorages;
    newAccountStorage;
    newSetupStorage;
    constructor(args) {
        super();
        this.skipConfirmation = Boolean(args.skipConfirmation);
        this.versionKey = args.versionKey;
        this.setupStorage = args.setupStorage;
        this.accountStorage = args.accountStorage;
        this.clientCredentialsStorage = args.clientCredentialsStorage;
        this.cleanupStorages = args.cleanupStorages;
        this.newAccountStorage = args.newAccountStorage;
        this.newSetupStorage = args.newSetupStorage;
    }
    async handle() {
        const previousVersion = await this.setupStorage.get(this.versionKey);
        if (!previousVersion) {
            // This happens if this is the first time the server is started
            this.logger.debug('No previous version found');
            return;
        }
        const [prevMajor] = previousVersion.split('.');
        if (Number.parseInt(prevMajor, 10) > 6) {
            return;
        }
        // Ask the user for confirmation
        if (!this.skipConfirmation) {
            const readline = (0, node_readline_1.createInterface)({ input: process.stdin, output: process.stdout });
            const answer = await new Promise((resolve) => {
                readline.question([
                    'The server is now going to migrate v6 data to the new storage format internally.',
                    'Existing accounts will be migrated.',
                    'All other internal data, such as notification subscriptions will be removed.',
                    'In case you have not yet done this,',
                    'it is recommended to cancel startup and first backup the existing data,',
                    'in case something goes wrong.',
                    'When using default configurations with a file backend,',
                    'this data can be found in the ".internal" folder.',
                    '\n\nDo you want to migrate the data now? [y/N] ',
                ].join(' '), resolve);
            });
            readline.close();
            if (!/^y(?:es)?$/iu.test(answer)) {
                throw new Error('Stopping server as migration was cancelled.');
            }
        }
        this.logger.info('Migrating v6 data...');
        const webIdAccountMap = {};
        for await (const [, account] of this.accountStorage.entries()) {
            const result = await this.createAccount(account);
            if (result) {
                // Store link between WebID and account ID for client credentials
                webIdAccountMap[result.webId] = result.accountId;
            }
        }
        this.logger.debug('Converting client credentials tokens.');
        // Convert the existing client credentials tokens
        for await (const [label, { webId, secret }] of this.clientCredentialsStorage.entries()) {
            const accountId = webIdAccountMap[webId];
            if (!accountId) {
                this.logger.warn(`Unable to find account for client credentials ${label}. Skipping migration of this token.`);
                continue;
            }
            await this.newAccountStorage.create(BaseClientCredentialsStore_1.CLIENT_CREDENTIALS_STORAGE_TYPE, { webId, label, secret, accountId });
        }
        this.logger.debug('Converting setup entries.');
        for await (const [key, value] of this.setupStorage.entries()) {
            await this.newSetupStorage.set(key, value);
            await this.setupStorage.delete(key);
        }
        // Cleanup all old entries
        this.logger.debug('Cleaning up older entries.');
        for (const storage of this.cleanupStorages) {
            for await (const [key] of storage.entries()) {
                await storage.delete(key);
            }
        }
        this.logger.info('Finished migrating v6 data.');
    }
    isAccount(data) {
        return Boolean(data.email);
    }
    /**
     * Creates a new account based on the account data found in the old storage.
     * Will always create an account and password entry.
     * In case `useIdp` is true, will create a WebID link entry.
     * In case there is an associated `podBaseUrl`, will create a pod and owner entry.
     */
    async createAccount(account) {
        if (!this.isAccount(account)) {
            return;
        }
        const { webId, email, password, verified } = account;
        this.logger.debug(`Migrating account ${email} with WebID ${webId}`);
        const settings = await this.accountStorage.get(webId);
        if (!settings) {
            this.logger.warn(`Unable to find settings for account ${email}. Skipping migration of this account.`);
            return;
        }
        const { id: accountId } = await this.newAccountStorage.create(LoginStorage_1.ACCOUNT_TYPE, {});
        // The `toLowerCase` call is important here to have the expected value
        await this.newAccountStorage.create(BasePasswordStore_1.PASSWORD_STORAGE_TYPE, { email: email.toLowerCase(), password, verified, accountId });
        if (settings.useIdp) {
            await this.newAccountStorage.create(BaseWebIdStore_1.WEBID_STORAGE_TYPE, { webId, accountId });
        }
        if (settings.podBaseUrl) {
            const { id: podId } = await this.newAccountStorage.create(BasePodStore_1.POD_STORAGE_TYPE, { baseUrl: settings.podBaseUrl, accountId });
            await this.newAccountStorage.create(BasePodStore_1.OWNER_STORAGE_TYPE, { webId, podId, visible: false });
        }
        return { accountId, webId };
    }
}
exports.V6MigrationInitializer = V6MigrationInitializer;
//# sourceMappingURL=V6MigrationInitializer.js.map