import type { ExpiringStorage } from '../../../../storage/keyvalue/ExpiringStorage';
import type { ForgotPasswordStore } from './ForgotPasswordStore';
/**
 * A {@link ForgotPasswordStore} using an {@link ExpiringStorage} to hold the necessary records.
 */
export declare class BaseForgotPasswordStore implements ForgotPasswordStore {
    private readonly storage;
    private readonly ttl;
    constructor(storage: ExpiringStorage<string, string>, ttl?: number);
    generate(email: string): Promise<string>;
    get(recordId: string): Promise<string | undefined>;
    delete(recordId: string): Promise<boolean>;
}
