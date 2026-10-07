import { Initializer } from '../../../../init/Initializer';
import type { AccountLoginStorage } from '../../account/util/LoginStorage';
import type { PasswordStore } from './PasswordStore';
export declare const PASSWORD_STORAGE_TYPE = "password";
export declare const PASSWORD_STORAGE_DESCRIPTION: {
    readonly email: "string";
    readonly password: "string";
    readonly verified: "boolean";
    readonly accountId: "id:account";
};
/**
 * A {@link PasswordStore} that uses a {@link KeyValueStorage} to store the entries.
 * Passwords are hashed and salted.
 * Default `saltRounds` is 10.
 */
export declare class BasePasswordStore extends Initializer implements PasswordStore {
    private readonly logger;
    private readonly storage;
    private readonly saltRounds;
    private initialized;
    constructor(storage: AccountLoginStorage<Record<string, never>>, saltRounds?: number);
    handle(): Promise<void>;
    create(email: string, accountId: string, password: string): Promise<string>;
    get(id: string): Promise<{
        email: string;
        accountId: string;
    } | undefined>;
    findByEmail(email: string): Promise<{
        accountId: string;
        id: string;
    } | undefined>;
    findByAccount(accountId: string): Promise<{
        id: string;
        email: string;
    }[]>;
    confirmVerification(id: string): Promise<void>;
    authenticate(email: string, password: string): Promise<{
        accountId: string;
        id: string;
    }>;
    update(id: string, password: string): Promise<void>;
    delete(id: string): Promise<void>;
}
