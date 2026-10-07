"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientIdAdapterFactory = exports.ClientIdAdapter = void 0;
const cross_fetch_1 = require("cross-fetch");
const LogUtil_1 = require("../../logging/LogUtil");
const ErrorUtil_1 = require("../../util/errors/ErrorUtil");
const FetchUtil_1 = require("../../util/FetchUtil");
const HeaderUtil_1 = require("../../util/HeaderUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const PassthroughAdapterFactory_1 = require("./PassthroughAdapterFactory");
/**
 * This {@link Adapter} redirects the `find` call to its source adapter.
 * In case no client data was found in the source for the given Client ID,
 * this class will do an HTTP GET request to that Client ID.
 * If the result is a valid Client ID document, that will be returned instead.
 *
 * See https://solidproject.org/TR/2022/oidc-20220328#clientids-document.
 */
class ClientIdAdapter extends PassthroughAdapterFactory_1.PassthroughAdapter {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    converter;
    constructor(name, source, converter) {
        super(name, source);
        this.converter = converter;
    }
    async find(id) {
        let payload = await this.source.find(id);
        // No payload is stored for the given Client ID.
        // Try to see if valid client metadata is found at the given Client ID.
        // The oidc-provider library will check if the redirect_uri matches an entry in the list of redirect_uris,
        // so no extra checks are needed from our side.
        if (!payload && this.name === 'Client' && (0, HeaderUtil_1.hasScheme)(id, 'http', 'https')) {
            this.logger.debug(`Looking for payload data at ${id}`);
            if (!/^https:|^http:\/\/localhost(?::\d+)?(?:\/|$)/u.test(id)) {
                throw new Error(`SSL is required for client_id authentication unless working locally.`);
            }
            const response = await (0, cross_fetch_1.fetch)(id);
            if (response.status !== 200) {
                throw new Error(`Unable to access data at ${id}: ${await response.text()}`);
            }
            const data = await response.text();
            let json;
            try {
                json = JSON.parse(data);
                const contexts = Array.isArray(json['@context']) ? json['@context'] : [json['@context']];
                // We can only parse as simple JSON if the @context is correct
                if (!contexts.includes('https://www.w3.org/ns/solid/oidc-context.jsonld')) {
                    throw new Error('Missing context https://www.w3.org/ns/solid/oidc-context.jsonld');
                }
            }
            catch (error) {
                json = undefined;
                this.logger.debug(`Found unexpected client ID for ${id}: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            }
            if (json) {
                // Need to make sure the document is about the id
                if (json.client_id !== id) {
                    throw new Error('The client registration `client_id` field must match the client ID');
                }
                payload = json;
            }
            else {
                // Since the client ID does not match the default JSON-LD we try to interpret it as RDF
                payload = await this.parseRdfClientId(data, id, response);
            }
            // `token_endpoint_auth_method: 'none'` prevents oidc-provider from requiring a client_secret
            // eslint-disable-next-line @typescript-eslint/naming-convention
            payload = { ...payload, token_endpoint_auth_method: 'none' };
        }
        // Will also be returned if no valid client data was found above
        return payload;
    }
    /**
     * Parses RDF data found at a Client ID.
     *
     * @param data - Raw data from the Client ID.
     * @param id - The actual Client ID.
     * @param response - Response object from the request.
     */
    async parseRdfClientId(data, id, response) {
        const representation = await (0, FetchUtil_1.responseToDataset)(response, this.converter, data);
        // Find the valid redirect URIs
        const redirectUris = [];
        for await (const entry of representation.data) {
            const triple = entry;
            if (triple.predicate.equals(Vocabularies_1.OIDC.terms.redirect_uris)) {
                redirectUris.push(triple.object.value);
            }
        }
        /* eslint-disable @typescript-eslint/naming-convention */
        return {
            client_id: id,
            redirect_uris: redirectUris,
        };
        /* eslint-enable @typescript-eslint/naming-convention */
    }
}
exports.ClientIdAdapter = ClientIdAdapter;
class ClientIdAdapterFactory extends PassthroughAdapterFactory_1.PassthroughAdapterFactory {
    converter;
    constructor(source, converter) {
        super(source);
        this.converter = converter;
    }
    createStorageAdapter(name) {
        return new ClientIdAdapter(name, this.source.createStorageAdapter(name), this.converter);
    }
}
exports.ClientIdAdapterFactory = ClientIdAdapterFactory;
//# sourceMappingURL=ClientIdAdapterFactory.js.map