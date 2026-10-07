import type { ResourcesGenerator } from '../pods/generate/ResourcesGenerator';
import type { KeyValueStorage } from '../storage/keyvalue/KeyValueStorage';
import type { ResourceStore } from '../storage/ResourceStore';
import { Initializer } from './Initializer';
export interface ContainerInitializerArgs {
    /**
     * Base URL of the server.
     */
    baseUrl: string;
    /**
     * Relative path of the container.
     */
    path: string;
    /**
     * ResourceStore where the container should be stored.
     */
    store: ResourceStore;
    /**
     * Generator that should be used to generate container contents.
     */
    generator: ResourcesGenerator;
    /**
     * Key that is used to store the boolean in the storage indicating the container is initialized.
     */
    storageKey: string;
    /**
     * Used to store initialization status.
     */
    storage: KeyValueStorage<string, boolean>;
}
/**
 * Initializer that sets up a container.
 * Will copy all the files and folders in the given path to the corresponding documents and containers.
 */
export declare class ContainerInitializer extends Initializer {
    protected readonly logger: import("..").Logger;
    private readonly store;
    private readonly containerId;
    private readonly generator;
    private readonly storageKey;
    private readonly storage;
    constructor(args: ContainerInitializerArgs);
    handle(): Promise<void>;
}
