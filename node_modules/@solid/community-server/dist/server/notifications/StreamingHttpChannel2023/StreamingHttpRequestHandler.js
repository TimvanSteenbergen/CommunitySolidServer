"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingHttpRequestHandler = void 0;
const node_stream_1 = require("node:stream");
const Permissions_1 = require("../../../authorization/permissions/Permissions");
const OkResponseDescription_1 = require("../../../http/output/response/OkResponseDescription");
const BasicRepresentation_1 = require("../../../http/representation/BasicRepresentation");
const LogUtil_1 = require("../../../logging/LogUtil");
const OperationHttpHandler_1 = require("../../OperationHttpHandler");
const GuardedStream_1 = require("../../../util/GuardedStream");
const IdentifierMap_1 = require("../../../util/map/IdentifierMap");
const ErrorUtil_1 = require("../../../util/errors/ErrorUtil");
const StreamUtil_1 = require("../../../util/StreamUtil");
const StreamingHttp2023Util_1 = require("./StreamingHttp2023Util");
/**
 * Handles request to Streaming HTTP receiveFrom endopints.
 * All allowed requests are stored in the {@link StreamingHttpMap}
 */
class StreamingHttpRequestHandler extends OperationHttpHandler_1.OperationHttpHandler {
    streamMap;
    route;
    generator;
    serializer;
    credentialsExtractor;
    permissionReader;
    authorizer;
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor(streamMap, route, generator, serializer, credentialsExtractor, permissionReader, authorizer) {
        super();
        this.streamMap = streamMap;
        this.route = route;
        this.generator = generator;
        this.serializer = serializer;
        this.credentialsExtractor = credentialsExtractor;
        this.permissionReader = permissionReader;
        this.authorizer = authorizer;
    }
    async handle({ operation, request }) {
        const encodedUrl = operation.target.path.replace(this.route.getPath(), '');
        const topic = decodeURIComponent(encodedUrl);
        // Verify if the client is allowed to connect
        const credentials = await this.credentialsExtractor.handleSafe(request);
        await this.authorize(credentials, topic);
        const stream = (0, GuardedStream_1.guardStream)(new node_stream_1.PassThrough());
        this.streamMap.add(topic, stream);
        stream.on('error', () => this.streamMap.deleteEntry(topic, stream));
        stream.on('close', () => this.streamMap.deleteEntry(topic, stream));
        const channel = (0, StreamingHttp2023Util_1.generateChannel)({ path: topic });
        // Send initial notification
        try {
            const notification = await this.generator.handle({ channel, topic: { path: topic } });
            const representation = await this.serializer.handleSafe({ channel, notification });
            // Ensure that the whole notification gets sent in a single chunk
            const chunk = await (0, StreamUtil_1.readableToString)(representation.data);
            stream.write(chunk);
        }
        catch (error) {
            this.logger.error(`Problem emitting initial notification: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
        }
        // Pre-established channels use Turtle
        const representation = new BasicRepresentation_1.BasicRepresentation(topic, operation.target, channel.accept);
        return new OkResponseDescription_1.OkResponseDescription(representation.metadata, stream);
    }
    async authorize(credentials, topic) {
        const requestedModes = new IdentifierMap_1.IdentifierSetMultiMap([[{ path: topic }, Permissions_1.AccessMode.read]]);
        this.logger.debug(`Retrieved required modes: ${[...requestedModes.entrySets()]
            .map(([id, set]) => `{ ${id.path}: ${[...set].join(',')} }`).join(',')}`);
        const availablePermissions = await this.permissionReader.handleSafe({ credentials, requestedModes });
        this.logger.debug(`Available permissions are ${[...availablePermissions.entries()]
            .map(([id, map]) => `{ ${id.path}: ${JSON.stringify(map)} }`).join(',')}`);
        await this.authorizer.handleSafe({ credentials, requestedModes, availablePermissions });
        this.logger.debug(`Authorization succeeded, creating notification channel`);
    }
}
exports.StreamingHttpRequestHandler = StreamingHttpRequestHandler;
//# sourceMappingURL=StreamingHttpRequestHandler.js.map