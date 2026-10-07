"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSubscriber = void 0;
const OkResponseDescription_1 = require("../../http/output/response/OkResponseDescription");
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const LogUtil_1 = require("../../logging/LogUtil");
const ContentTypes_1 = require("../../util/ContentTypes");
const ErrorUtil_1 = require("../../util/errors/ErrorUtil");
const UnprocessableEntityHttpError_1 = require("../../util/errors/UnprocessableEntityHttpError");
const StreamUtil_1 = require("../../util/StreamUtil");
const OperationHttpHandler_1 = require("../OperationHttpHandler");
/**
 * Handles notification subscriptions by creating a notification channel.
 *
 * Uses the information from the provided {@link NotificationChannelType} to validate the input
 * and verify the request has the required permissions available.
 * If successful the generated channel will be stored in a {@link NotificationChannelStorage}.
 */
class NotificationSubscriber extends OperationHttpHandler_1.OperationHttpHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    channelType;
    converter;
    credentialsExtractor;
    permissionReader;
    authorizer;
    storage;
    maxDuration;
    constructor(args) {
        super();
        this.channelType = args.channelType;
        this.converter = args.converter;
        this.credentialsExtractor = args.credentialsExtractor;
        this.permissionReader = args.permissionReader;
        this.authorizer = args.authorizer;
        this.storage = args.storage;
        this.maxDuration = (args.maxDuration ?? 20160) * 60 * 1000;
    }
    async handle({ operation, request }) {
        if (operation.method === 'GET' || operation.method === 'HEAD') {
            const description = JSON.stringify(this.channelType.getDescription(), null, 2);
            const representation = new BasicRepresentation_1.BasicRepresentation(description, operation.target, ContentTypes_1.APPLICATION_LD_JSON);
            return new OkResponseDescription_1.OkResponseDescription(representation.metadata, operation.method === 'GET' ? representation.data : undefined);
        }
        const credentials = await this.credentialsExtractor.handleSafe(request);
        this.logger.debug(`Extracted credentials: ${JSON.stringify(credentials)}`);
        let channel;
        try {
            const quadStream = await this.converter.handleSafe({
                identifier: operation.target,
                representation: operation.body,
                preferences: { type: { [ContentTypes_1.INTERNAL_QUADS]: 1 } },
            });
            channel = await this.channelType.initChannel(await (0, StreamUtil_1.readableToQuads)(quadStream.data), credentials);
        }
        catch (error) {
            throw new UnprocessableEntityHttpError_1.UnprocessableEntityHttpError(`Unable to process notification channel: ${(0, ErrorUtil_1.createErrorMessage)(error)}`, { cause: error });
        }
        if (this.maxDuration) {
            const duration = (channel.endAt ?? Number.POSITIVE_INFINITY) - Date.now();
            if (duration > this.maxDuration) {
                channel.endAt = Date.now() + this.maxDuration;
            }
        }
        // Verify if the client is allowed to subscribe
        await this.authorize(credentials, channel);
        // Store the channel once it has been authorized
        await this.storage.add(channel);
        // Generate the response JSON-LD
        const jsonld = await this.channelType.toJsonLd(channel);
        const response = new BasicRepresentation_1.BasicRepresentation(JSON.stringify(jsonld), ContentTypes_1.APPLICATION_LD_JSON);
        // Complete the channel once the response has been sent out
        (0, StreamUtil_1.endOfStream)(response.data)
            .then(async () => this.channelType.completeChannel(channel))
            .catch((error) => {
            this.logger.error(`There was an issue completing notification channel ${channel.id}: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
        });
        return new OkResponseDescription_1.OkResponseDescription(response.metadata, response.data);
    }
    async authorize(credentials, channel) {
        const requestedModes = await this.channelType.extractModes(channel);
        this.logger.debug(`Retrieved required modes: ${[...requestedModes.entrySets()]
            .map(([id, set]) => `{ ${id.path}: ${[...set].join(',')} }`).join(',')}`);
        const availablePermissions = await this.permissionReader.handleSafe({ credentials, requestedModes });
        this.logger.debug(`Available permissions are ${[...availablePermissions.entries()]
            .map(([id, map]) => `{ ${id.path}: ${JSON.stringify(map)} }`).join(',')}`);
        await this.authorizer.handleSafe({ credentials, requestedModes, availablePermissions });
        this.logger.debug(`Authorization succeeded, creating notification channel`);
    }
}
exports.NotificationSubscriber = NotificationSubscriber;
//# sourceMappingURL=NotificationSubscriber.js.map