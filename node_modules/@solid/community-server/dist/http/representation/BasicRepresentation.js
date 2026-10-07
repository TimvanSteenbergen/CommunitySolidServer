"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicRepresentation = void 0;
const ContentTypes_1 = require("../../util/ContentTypes");
const GuardedStream_1 = require("../../util/GuardedStream");
const StreamUtil_1 = require("../../util/StreamUtil");
const RepresentationMetadata_1 = require("./RepresentationMetadata");
/**
 * Class with various constructors to facilitate creating a representation.
 *
 * A representation consists of 1) data, 2) metadata, and 3) a binary flag
 * to indicate whether the data is a binary stream or an object stream.
 *
 * 1. The data can be given as a stream, array, or string.
 * 2. The metadata can be specified as one or two parameters
 *    that will be passed to the {@link RepresentationMetadata} constructor.
 * 3. The binary field is optional, and if not specified,
 *    is determined from the content type inside the metadata.
 */
class BasicRepresentation {
    data;
    metadata;
    binary;
    constructor(data, metadata, metadataRest, binary) {
        if (typeof data === 'string' || Array.isArray(data)) {
            data = (0, StreamUtil_1.guardedStreamFrom)(data);
        }
        else if (!data) {
            data = (0, StreamUtil_1.guardedStreamFrom)([]);
        }
        this.data = (0, GuardedStream_1.guardStream)(data);
        if (typeof metadataRest === 'boolean') {
            binary = metadataRest;
            metadataRest = undefined;
        }
        if (!(0, RepresentationMetadata_1.isRepresentationMetadata)(metadata) || typeof metadataRest === 'string') {
            // This combination will always match with a valid overload
            metadata = new RepresentationMetadata_1.RepresentationMetadata(metadata, metadataRest);
        }
        this.metadata = metadata;
        if (typeof binary !== 'boolean') {
            binary = metadata.contentType !== ContentTypes_1.INTERNAL_QUADS;
        }
        this.binary = binary;
    }
    /**
     * Data should only be interpreted if there is a content type.
     */
    get isEmpty() {
        return !this.metadata.contentType;
    }
}
exports.BasicRepresentation = BasicRepresentation;
//# sourceMappingURL=BasicRepresentation.js.map