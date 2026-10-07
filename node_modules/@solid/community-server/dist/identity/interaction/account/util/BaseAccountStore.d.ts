import type { MinimalAccountSettings } from './AccountStore';
import { GenericAccountStore } from './GenericAccountStore';
import type { AccountLoginStorage } from './LoginStorage';
export declare const ACCOUNT_STORAGE_DESCRIPTION: {
    readonly rememberLogin: "boolean?";
};
/**
 * A {@link GenericAccountStore} that supports the minimal account settings.
 * Needs to be initialized before it can be used.
 */
export declare class BaseAccountStore extends GenericAccountStore<MinimalAccountSettings> {
    constructor(storage: AccountLoginStorage<Record<string, never>>);
}
