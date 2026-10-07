import type { Adapter, AdapterPayload } from '../../../templates/types/oidc-provider';
import type { AdapterFactory } from './AdapterFactory';
/**
 * OIDC Adapter that calls the corresponding functions of the source Adapter.
 * Can be extended by adapters that do not want to override all functions
 * by implementing a decorator pattern.
 */
export declare class PassthroughAdapter implements Adapter {
    protected readonly name: string;
    protected readonly source: Adapter;
    constructor(name: string, source: Adapter);
    upsert(id: string, payload: AdapterPayload, expiresIn: number): Promise<void | undefined>;
    find(id: string): Promise<AdapterPayload | void | undefined>;
    findByUserCode(userCode: string): Promise<AdapterPayload | void | undefined>;
    findByUid(uid: string): Promise<AdapterPayload | void | undefined>;
    consume(id: string): Promise<void | undefined>;
    destroy(id: string): Promise<void | undefined>;
    revokeByGrantId(grantId: string): Promise<void | undefined>;
}
export declare class PassthroughAdapterFactory implements AdapterFactory {
    protected readonly source: AdapterFactory;
    constructor(source: AdapterFactory);
    createStorageAdapter(name: string): Adapter;
}
