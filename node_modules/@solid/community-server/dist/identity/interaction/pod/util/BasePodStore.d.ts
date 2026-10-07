import { Initializer } from '../../../../init/Initializer';
import type { PodManager } from '../../../../pods/PodManager';
import type { PodSettings } from '../../../../pods/settings/PodSettings';
import type { AccountLoginStorage } from '../../account/util/LoginStorage';
import type { PodStore } from './PodStore';
export declare const POD_STORAGE_TYPE = "pod";
export declare const POD_STORAGE_DESCRIPTION: {
    readonly baseUrl: "string";
    readonly accountId: "id:account";
};
export declare const OWNER_STORAGE_TYPE = "owner";
export declare const OWNER_STORAGE_DESCRIPTION: {
    readonly webId: "string";
    readonly visible: "boolean";
    readonly podId: "id:pod";
};
/**
 * A {@link PodStore} implementation using a {@link PodManager} to create pods
 * and a {@link AccountLoginStorage} to store the data.
 * Needs to be initialized before it can be used.
 *
 * Adds the initial WebID as the owner of the pod.
 * By default, this owner is not exposed through a link header.
 * This can be changed by setting the constructor `visible` parameter to `true`.
 */
export declare class BasePodStore extends Initializer implements PodStore {
    private readonly logger;
    private readonly storage;
    private readonly manager;
    private readonly visible;
    private initialized;
    constructor(storage: AccountLoginStorage<Record<string, never>>, manager: PodManager, visible?: boolean);
    handle(): Promise<void>;
    create(accountId: string, settings: PodSettings, overwrite: boolean): Promise<string>;
    get(id: string): Promise<{
        baseUrl: string;
        accountId: string;
    } | undefined>;
    findByBaseUrl(baseUrl: string): Promise<{
        id: string;
        accountId: string;
    } | undefined>;
    findPods(accountId: string): Promise<{
        id: string;
        baseUrl: string;
    }[]>;
    getOwners(id: string): Promise<{
        webId: string;
        visible: boolean;
    }[] | undefined>;
    updateOwner(id: string, webId: string, visible: boolean): Promise<void>;
    removeOwner(id: string, webId: string): Promise<void>;
}
