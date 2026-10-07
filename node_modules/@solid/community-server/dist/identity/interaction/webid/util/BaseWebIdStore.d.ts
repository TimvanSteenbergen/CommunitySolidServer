import { Initializer } from '../../../../init/Initializer';
import type { AccountLoginStorage } from '../../account/util/LoginStorage';
import type { WebIdStore } from './WebIdStore';
export declare const WEBID_STORAGE_TYPE = "webIdLink";
export declare const WEBID_STORAGE_DESCRIPTION: {
    readonly webId: "string";
    readonly accountId: "id:account";
};
/**
 * A {@link WebIdStore} using a {@link AccountLoginStorage} to store the links.
 * Needs to be initialized before it can be used.
 */
export declare class BaseWebIdStore extends Initializer implements WebIdStore {
    private readonly logger;
    private readonly storage;
    private initialized;
    constructor(storage: AccountLoginStorage<Record<string, never>>);
    handle(): Promise<void>;
    get(id: string): Promise<{
        accountId: string;
        webId: string;
    } | undefined>;
    isLinked(webId: string, accountId: string): Promise<boolean>;
    findLinks(accountId: string): Promise<{
        id: string;
        webId: string;
    }[]>;
    create(webId: string, accountId: string): Promise<string>;
    delete(linkId: string): Promise<void>;
}
