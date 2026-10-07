"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCredentialsAdapterFactory = exports.ClientCredentialsAdapter = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const PassthroughAdapterFactory_1 = require("../../storage/PassthroughAdapterFactory");
/**
 * A {@link PassthroughAdapter} that overrides the `find` function
 * by checking if there are stored client credentials for the given ID
 * if no payload is found in the source.
 */
class ClientCredentialsAdapter extends PassthroughAdapterFactory_1.PassthroughAdapter {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    webIdStore;
    clientCredentialsStore;
    constructor(name, source, webIdStore, clientCredentialsStore) {
        super(name, source);
        this.webIdStore = webIdStore;
        this.clientCredentialsStore = clientCredentialsStore;
    }
    async find(label) {
        let payload = await this.source.find(label);
        if (!payload && this.name === 'Client') {
            const credentials = await this.clientCredentialsStore.findByLabel(label);
            if (!credentials) {
                return payload;
            }
            // Make sure the WebID wasn't unlinked in the meantime
            const valid = await this.webIdStore.isLinked(credentials.webId, credentials.accountId);
            if (!valid) {
                this.logger.error(`Client credentials token ${label} contains WebID that is no longer linked to the account. Removing...`);
                await this.clientCredentialsStore.delete(credentials.id);
                return payload;
            }
            this.logger.debug(`Authenticating as ${credentials.webId} using client credentials`);
            /* eslint-disable @typescript-eslint/naming-convention */
            payload = {
                client_id: label,
                client_secret: credentials.secret,
                grant_types: ['client_credentials'],
                redirect_uris: [],
                response_types: [],
            };
            /* eslint-enable @typescript-eslint/naming-convention */
        }
        return payload;
    }
}
exports.ClientCredentialsAdapter = ClientCredentialsAdapter;
class ClientCredentialsAdapterFactory extends PassthroughAdapterFactory_1.PassthroughAdapterFactory {
    webIdStore;
    clientCredentialsStore;
    constructor(source, webIdStore, clientCredentialsStore) {
        super(source);
        this.webIdStore = webIdStore;
        this.clientCredentialsStore = clientCredentialsStore;
    }
    createStorageAdapter(name) {
        const adapter = this.source.createStorageAdapter(name);
        return new ClientCredentialsAdapter(name, adapter, this.webIdStore, this.clientCredentialsStore);
    }
}
exports.ClientCredentialsAdapterFactory = ClientCredentialsAdapterFactory;
//# sourceMappingURL=ClientCredentialsAdapterFactory.js.map