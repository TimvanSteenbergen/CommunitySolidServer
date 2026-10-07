"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingHttpMetadataWriter = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const PathUtil_1 = require("../../../util/PathUtil");
const MetadataWriter_1 = require("../../../http/output/metadata/MetadataWriter");
/**
 * A {@link MetadataWriter} that adds a link to the receiveFrom endpoint
 * of the corresponding Streaming HTTP notifications channel
 */
class StreamingHttpMetadataWriter extends MetadataWriter_1.MetadataWriter {
    route;
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor(route) {
        super();
        this.route = route;
    }
    async handle(input) {
        const encodedUrl = encodeURIComponent(input.metadata.identifier.value);
        const receiveFrom = (0, PathUtil_1.joinUrl)(this.route.getPath(), encodedUrl);
        const link = `<${receiveFrom}>; rel="http://www.w3.org/ns/solid/terms#updatesViaStreamingHttp2023"`;
        this.logger.debug('Adding updatesViaStreamingHttp2023  to the Link header');
        (0, HeaderUtil_1.addHeader)(input.response, 'Link', link);
    }
}
exports.StreamingHttpMetadataWriter = StreamingHttpMetadataWriter;
//# sourceMappingURL=StreamingHttpMetadataWriter.js.map