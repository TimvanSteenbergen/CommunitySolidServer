"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedJwkGenerator = void 0;
const node_crypto_1 = require("node:crypto");
const jose_1 = require("jose");
/**
 * Generates a key pair once and then caches it using both an internal variable and a {@link KeyValueStorage}.
 * The storage makes sure the keys remain the same between server restarts,
 * while the internal variable makes it so the storage doesn't have to be accessed every time a key is needed.
 *
 * Only the private key is stored in the internal storage, using the `storageKey` parameter.
 * The public key is determined based on the private key and then also stored in memory.
 */
class CachedJwkGenerator {
    alg;
    key;
    storage;
    privateJwk;
    publicJwk;
    constructor(alg, storageKey, storage) {
        this.alg = alg;
        this.key = storageKey;
        this.storage = storage;
    }
    async getPrivateKey() {
        if (this.privateJwk) {
            return this.privateJwk;
        }
        // We store in JWKS format for backwards compatibility reasons.
        // If we want to just store the key instead we will need some way to do the migration.
        const jwks = await this.storage.get(this.key);
        if (jwks) {
            this.privateJwk = jwks.keys[0];
            return this.privateJwk;
        }
        const { privateKey } = await (0, jose_1.generateKeyPair)(this.alg);
        // Make sure the JWK is a plain node object for storage
        const privateJwk = { ...await (0, jose_1.exportJWK)(privateKey) };
        privateJwk.alg = this.alg;
        await this.storage.set(this.key, { keys: [privateJwk] });
        this.privateJwk = privateJwk;
        return privateJwk;
    }
    async getPublicKey() {
        if (this.publicJwk) {
            return this.publicJwk;
        }
        const privateJwk = await this.getPrivateKey();
        // The main reason we generate the public key from the private key is, so we don't have to store it.
        // This allows our storage to not break previous versions where we only used the private key.
        // In practice this results in the same key.
        const privateKey = await (0, jose_1.importJWK)(privateJwk);
        const publicKey = (0, node_crypto_1.createPublicKey)(privateKey);
        const publicJwk = { ...await (0, jose_1.exportJWK)(publicKey) };
        // These fields get lost during the above proces
        publicJwk.alg = privateJwk.alg;
        this.publicJwk = publicJwk;
        return publicJwk;
    }
}
exports.CachedJwkGenerator = CachedJwkGenerator;
//# sourceMappingURL=CachedJwkGenerator.js.map