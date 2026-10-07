import { Initializer } from '../../../../init/Initializer';
import type { AccountLoginStorage } from '../../account/util/LoginStorage';
import type { ClientCredentials, ClientCredentialsStore } from './ClientCredentialsStore';
export declare const CLIENT_CREDENTIALS_STORAGE_TYPE = "clientCredentials";
export declare const CLIENT_CREDENTIALS_STORAGE_DESCRIPTION: {
    readonly label: "string";
    readonly accountId: "id:account";
    readonly secret: "string";
    readonly webId: "string";
};
/**
 * A {@link ClientCredentialsStore} that uses a {@link AccountLoginStorage} for storing the tokens.
 * Needs to be initialized before it can be used.
 */
export declare class BaseClientCredentialsStore extends Initializer implements ClientCredentialsStore {
    private readonly logger;
    private readonly storage;
    private initialized;
    constructor(storage: AccountLoginStorage<Record<string, never>>);
    handle(): Promise<void>;
    get(id: string): Promise<ClientCredentials | undefined>;
    findByLabel(label: string): Promise<ClientCredentials | undefined>;
    findByAccount(accountId: string): Promise<ClientCredentials[]>;
    create(label: string, webId: string, accountId: string): Promise<ClientCredentials>;
    delete(id: string): Promise<void>;
}
