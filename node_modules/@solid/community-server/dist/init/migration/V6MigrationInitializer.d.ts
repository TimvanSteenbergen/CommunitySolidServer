import type { AccountLoginStorage } from '../../identity/interaction/account/util/LoginStorage';
import type { KeyValueStorage } from '../../storage/keyvalue/KeyValueStorage';
import { Initializer } from '../Initializer';
type Account = {
    webId: string;
    email: string;
    password: string;
    verified: boolean;
};
type Settings = {
    useIdp: boolean;
    podBaseUrl?: string;
    clientCredentials?: string[];
};
type ClientCredentials = {
    webId: string;
    secret: string;
};
export interface V6MigrationInitializerArgs {
    /**
     * The storage in which all setup values are stored, including the version of the server.
     */
    setupStorage: KeyValueStorage<string, string>;
    /**
     * The key necessary to get the version from the `setupStorage`.
     */
    versionKey: string;
    /**
     * The storage in which account data of the previous version is stored.
     */
    accountStorage: KeyValueStorage<string, Account | Settings>;
    /**
     * The storage in which client credentials are stored from the previous version.
     */
    clientCredentialsStorage: KeyValueStorage<string, ClientCredentials>;
    /**
     * Storages for which all entries need to be removed.
     */
    cleanupStorages: KeyValueStorage<string, any>[];
    /**
     * The storage that will contain the account data in the new format.
     * Wrong typings to prevent Components.js typing issues.
     */
    newAccountStorage: AccountLoginStorage<Record<string, never>>;
    /**
     * The storage that will contain the setup entries in the new format.
     */
    newSetupStorage: KeyValueStorage<string, string>;
    /**
     * If true, no confirmation prompt will be printed to the stdout.
     */
    skipConfirmation?: boolean;
}
/**
 * Handles migrating account data from v6 to the newer format.
 * Will only trigger if it is detected that this server was previously started on an older version
 * and at least one account was found.
 * Confirmation will be asked to the user through a CLI prompt.
 * After migration is complete the old data will be removed.
 */
export declare class V6MigrationInitializer extends Initializer {
    private readonly logger;
    private readonly skipConfirmation;
    private readonly versionKey;
    private readonly setupStorage;
    private readonly accountStorage;
    private readonly clientCredentialsStorage;
    private readonly cleanupStorages;
    private readonly newAccountStorage;
    private readonly newSetupStorage;
    constructor(args: V6MigrationInitializerArgs);
    handle(): Promise<void>;
    protected isAccount(data: Account | Settings): data is Account;
    /**
     * Creates a new account based on the account data found in the old storage.
     * Will always create an account and password entry.
     * In case `useIdp` is true, will create a WebID link entry.
     * In case there is an associated `podBaseUrl`, will create a pod and owner entry.
     */
    protected createAccount(account: Account | Settings): Promise<{
        accountId: string;
        webId: string;
    } | undefined>;
}
export {};
