"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityProviderFactory = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const node_crypto_1 = require("node:crypto");
const LogUtil_1 = require("../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../util/errors/BadRequestHttpError");
const HttpErrorUtil_1 = require("../../util/errors/HttpErrorUtil");
const OAuthHttpError_1 = require("../../util/errors/OAuthHttpError");
const GuardedStream_1 = require("../../util/GuardedStream");
const PathUtil_1 = require("../../util/PathUtil");
const IdentityUtil_1 = require("../IdentityUtil");
const COOKIES_KEY = 'cookie-secret';
/**
 * Creates an OIDC Provider based on the provided configuration and parameters.
 * The provider will be cached and returned on subsequent calls.
 * Cookie and JWT keys will be stored in an internal storage, so they can be re-used over multiple threads.
 * Necessary claims for Solid OIDC interactions will be added.
 * Routes will be updated based on the `baseUrl` and `oidcPath`.
 */
class IdentityProviderFactory {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    promptFactory;
    config;
    adapterFactory;
    baseUrl;
    oidcPath;
    interactionRoute;
    clientCredentialsStore;
    storage;
    jwkGenerator;
    showStackTrace;
    errorHandler;
    responseWriter;
    provider;
    /**
     * @param config - JSON config for the OIDC library @range {json}
     * @param args - Remaining parameters required for the factory.
     */
    constructor(config, args) {
        this.config = config;
        this.promptFactory = args.promptFactory;
        this.adapterFactory = args.adapterFactory;
        this.baseUrl = args.baseUrl;
        this.oidcPath = args.oidcPath;
        this.interactionRoute = args.interactionRoute;
        this.clientCredentialsStore = args.clientCredentialsStore;
        this.storage = args.storage;
        this.jwkGenerator = args.jwkGenerator;
        this.showStackTrace = args.showStackTrace;
        this.errorHandler = args.errorHandler;
        this.responseWriter = args.responseWriter;
    }
    async getProvider() {
        if (this.provider) {
            return this.provider;
        }
        this.provider = await this.createProvider();
        return this.provider;
    }
    /**
     * Creates a Provider by building a Configuration using all the stored parameters.
     */
    async createProvider() {
        const key = await this.jwkGenerator.getPrivateKey();
        const config = await this.initConfig(key);
        // Add correct claims to IdToken/AccessToken responses
        this.configureClaims(config, key.alg);
        // Make sure routes are contained in the IDP space
        this.configureRoutes(config);
        // Render errors with our own error handler
        this.configureErrors(config);
        const oidcImport = await (0, IdentityUtil_1.importOidcProvider)();
        // Adds new prompts
        const policy = oidcImport.interactionPolicy.base();
        await this.promptFactory.handleSafe(policy);
        config.interactions.policy = policy;
        // eslint-disable-next-line new-cap
        const provider = new oidcImport.default(this.baseUrl, config);
        // Allow provider to interpret reverse proxy headers.
        provider.proxy = true;
        this.captureErrorResponses(provider);
        return provider;
    }
    /**
     * In the `configureErrors` function below, we configure the `renderError` function of the provider configuration.
     * This function is called by the OIDC provider library to render errors,
     * but only does this if the accept header is HTML.
     * Otherwise, it just returns the error object itself as a JSON object.
     * See https://github.com/panva/node-oidc-provider/blob/0fcc112e0a95b3b2dae4eba6da812253277567c9/lib/shared/error_handler.js#L48-L52.
     *
     * In this function we override the `ctx.accepts` function
     * to make the above code think HTML is always requested there.
     * This way we have full control over error representation as configured in `configureErrors`.
     * We still check the accept headers ourselves so there still is content negotiation on the output,
     * the client will not simply always receive HTML.
     *
     * Should this part of the OIDC library code ever change, our function will break,
     * at which point behaviour will simply revert to what it was before.
     */
    captureErrorResponses(provider) {
        provider.use(async (ctx, next) => {
            const accepts = ctx.accepts.bind(ctx);
            ctx.accepts = ((...types) => {
                // Make sure we only override our specific case
                if (types.length === 2 && types[0] === 'json' && types[1] === 'html') {
                    return 'html';
                }
                return accepts(...types);
            });
            return next();
        });
    }
    /**
     * Creates a configuration by copying the internal configuration
     * and adding the adapter, default audience and jwks/cookie keys.
     */
    async initConfig(key) {
        // Create a deep copy
        // Not sure why the structuredClone call is causing issues with the library.
        /* eslint-disable-next-line unicorn/prefer-structured-clone */
        const config = JSON.parse(JSON.stringify(this.config));
        // Indicates which Adapter should be used for storing oidc data
        // The adapter function MUST be a named function.
        // See https://github.com/panva/node-oidc-provider/issues/799
        const factory = this.adapterFactory;
        config.adapter = function loadAdapter(name) {
            return factory.createStorageAdapter(name);
        };
        config.jwks = { keys: [key] };
        config.cookies = {
            ...config.cookies,
            keys: await this.generateCookieKeys(),
        };
        // Solid OIDC requires pkce https://solid.github.io/solid-oidc/#concepts
        config.pkce = {
            methods: ['S256'],
            required: () => true,
        };
        // Default client settings that might not be defined.
        // Mostly relevant for WebID clients.
        config.clientDefaults = {
            id_token_signed_response_alg: key.alg,
        };
        return config;
    }
    /**
     * Generates a cookie secret to be used for cookie signing.
     * The key will be cached so subsequent calls return the same key.
     */
    async generateCookieKeys() {
        // Check to see if the keys are already saved
        const cookieSecret = await this.storage.get(COOKIES_KEY);
        if (Array.isArray(cookieSecret)) {
            return cookieSecret;
        }
        // If they are not, generate and save them
        const newCookieSecret = [(0, node_crypto_1.randomBytes)(64).toString('hex')];
        await this.storage.set(COOKIES_KEY, newCookieSecret);
        return newCookieSecret;
    }
    /**
     * Checks whether the given token is an access token.
     * The AccessToken interface is not exported, so we have to access it like this.
     */
    isAccessToken(token) {
        return token?.kind === 'AccessToken';
    }
    /**
     * Adds the necessary claims to the id and access tokens based on the Solid OIDC spec.
     */
    configureClaims(config, jwtAlg) {
        // Returns the id_token
        // See https://solid.github.io/authentication-panel/solid-oidc/#tokens-id
        // Some fields are still missing, see https://github.com/CommunitySolidServer/CommunitySolidServer/issues/1154#issuecomment-1040233385
        config.findAccount = async (ctx, sub) => ({
            accountId: sub,
            async claims() {
                return { sub, webid: sub, azp: ctx.oidc.client?.clientId };
            },
        });
        // Add extra claims in case an AccessToken is being issued.
        // Specifically this sets the required webid and client_id claims for the access token
        // See https://solid.github.io/solid-oidc/#resource-access-validation
        config.extraTokenClaims = async (ctx, token) => {
            if (this.isAccessToken(token)) {
                return { webid: token.accountId };
            }
            const clientId = token.client?.clientId;
            if (!clientId) {
                throw new BadRequestHttpError_1.BadRequestHttpError('Missing client ID from client credentials.');
            }
            const webId = (await this.clientCredentialsStore.findByLabel(clientId))?.webId;
            if (!webId) {
                throw new BadRequestHttpError_1.BadRequestHttpError(`Unknown client credentials token ${clientId}`);
            }
            return { webid: webId };
        };
        config.features = {
            ...config.features,
            resourceIndicators: {
                defaultResource() {
                    // This value is irrelevant, but is necessary to trigger the `getResourceServerInfo` call below,
                    // where it will be an input parameter in case the client provided no value.
                    // Note that an empty string is not a valid value.
                    return 'http://example.com/';
                },
                enabled: true,
                // This call is necessary to force the OIDC library to return a JWT access token.
                // See https://github.com/panva/node-oidc-provider/discussions/959#discussioncomment-524757
                getResourceServerInfo: () => ({
                    // The scopes of the Resource Server.
                    // These get checked when requesting client credentials.
                    scope: '',
                    audience: 'solid',
                    accessTokenFormat: 'jwt',
                    jwt: {
                        sign: { alg: jwtAlg },
                    },
                }),
            },
        };
    }
    /**
     * Creates the route string as required by the `oidc-provider` library.
     * In case base URL is `http://test.com/foo/`, `oidcPath` is `/idp` and `relative` is `device/auth`,
     * this would result in `/foo/idp/device/auth`.
     */
    createRoute(relative) {
        return new URL((0, PathUtil_1.joinUrl)(this.baseUrl, this.oidcPath, relative)).pathname;
    }
    /**
     * Sets up all the IDP routes relative to the IDP path.
     */
    configureRoutes(config) {
        // When oidc-provider cannot fulfill the authorization request for any of the possible reasons
        // (missing user session, requested ACR not fulfilled, prompt requested, ...)
        // it will resolve the interactions.url helper function and redirect the User-Agent to that url.
        // Another requirement is that `features.userinfo` is disabled in the configuration.
        config.interactions = {
            url: async () => this.interactionRoute.getPath(),
        };
        config.routes = {
            authorization: this.createRoute('auth'),
            backchannel_authentication: this.createRoute('backchannel'),
            code_verification: this.createRoute('device'),
            device_authorization: this.createRoute('device/auth'),
            end_session: this.createRoute('session/end'),
            introspection: this.createRoute('token/introspection'),
            jwks: this.createRoute('jwks'),
            pushed_authorization_request: this.createRoute('request'),
            registration: this.createRoute('reg'),
            revocation: this.createRoute('token/revocation'),
            token: this.createRoute('token'),
            userinfo: this.createRoute('me'),
        };
    }
    /**
     * Pipes library errors to the provided ErrorHandler and ResponseWriter.
     */
    configureErrors(config) {
        config.renderError = async (ctx, out, error) => {
            // This allows us to stream directly to the response object, see https://github.com/koajs/koa/issues/944
            ctx.respond = false;
            // Doesn't really matter which type it is since all relevant fields are optional
            const oidcError = error;
            // Create a more detailed error message for logging and to show is `showStackTrace` is enabled.
            let detailedError = oidcError.message;
            if (oidcError.error_description) {
                detailedError += ` - ${oidcError.error_description}`;
            }
            if (oidcError.error_detail) {
                detailedError += ` - ${oidcError.error_detail}`;
            }
            this.logger.warn(`OIDC request failed: ${detailedError}`);
            // Convert to our own error object.
            // This ensures serializing the error object will generate the correct output later on.
            // We specifically copy the fields instead of passing the object to contain the `oidc-provider` dependency
            // to the current file.
            let resultingError = new OAuthHttpError_1.OAuthHttpError(out, oidcError.name, oidcError.statusCode, oidcError.message);
            // Keep the original stack to make debugging easier
            resultingError.stack = oidcError.stack;
            if (this.showStackTrace) {
                // Expose more information if `showStackTrace` is enabled
                resultingError.message = detailedError;
                // Also change the error message in the stack trace
                if (resultingError.stack) {
                    resultingError.stack = resultingError.stack.replace(/.*/u, `${oidcError.name}: ${oidcError.message}`);
                }
            }
            // A client not being found is quite often the result of cookies being stored by the authn client,
            // so we want to provide a more detailed error message explaining what to do.
            if (oidcError.error_description === 'client is invalid' && oidcError.error_detail === 'client not found') {
                const unknownClientError = new BadRequestHttpError_1.BadRequestHttpError('Unknown client, you might need to clear the local storage on the client.', {
                    errorCode: 'E0003',
                    metadata: (0, HttpErrorUtil_1.errorTermsToMetadata)({
                        client_id: ctx.request.query.client_id,
                        redirect_uri: ctx.request.query.redirect_uri,
                    }),
                });
                unknownClientError.stack = oidcError.stack;
                resultingError = unknownClientError;
            }
            const result = await this.errorHandler.handleSafe({ error: resultingError, request: (0, GuardedStream_1.guardStream)(ctx.req) });
            await this.responseWriter.handleSafe({ response: ctx.res, result });
        };
    }
}
exports.IdentityProviderFactory = IdentityProviderFactory;
//# sourceMappingURL=IdentityProviderFactory.js.map