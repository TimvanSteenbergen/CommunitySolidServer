import type { AsymmetricSigningAlgorithm, JWKS } from '../../../templates/types/oidc-provider';
import type { KeyValueStorage } from '../../storage/keyvalue/KeyValueStorage';
import type { AlgJwk, JwkGenerator } from './JwkGenerator';
/**
 * Generates a key pair once and then caches it using both an internal variable and a {@link KeyValueStorage}.
 * The storage makes sure the keys remain the same between server restarts,
 * while the internal variable makes it so the storage doesn't have to be accessed every time a key is needed.
 *
 * Only the private key is stored in the internal storage, using the `storageKey` parameter.
 * The public key is determined based on the private key and then also stored in memory.
 */
export declare class CachedJwkGenerator implements JwkGenerator {
    readonly alg: AsymmetricSigningAlgorithm;
    private readonly key;
    private readonly storage;
    private privateJwk?;
    private publicJwk?;
    constructor(alg: AsymmetricSigningAlgorithm, storageKey: string, storage: KeyValueStorage<string, JWKS>);
    getPrivateKey(): Promise<AlgJwk>;
    getPublicKey(): Promise<AlgJwk>;
}
