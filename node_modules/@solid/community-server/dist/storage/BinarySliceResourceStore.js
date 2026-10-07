"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinarySliceResourceStore = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const InternalServerError_1 = require("../util/errors/InternalServerError");
const RangeNotSatisfiedHttpError_1 = require("../util/errors/RangeNotSatisfiedHttpError");
const GuardedStream_1 = require("../util/GuardedStream");
const QuadUtil_1 = require("../util/QuadUtil");
const SliceStream_1 = require("../util/SliceStream");
const TermUtil_1 = require("../util/TermUtil");
const Vocabularies_1 = require("../util/Vocabularies");
const PassthroughStore_1 = require("./PassthroughStore");
/**
 * Resource store that slices the data stream if there are range preferences.
 * Only works for `bytes` range preferences on binary data streams.
 * Does not support multipart range requests.
 *
 * If the slice happens, unit/start/end values will be written to the metadata to indicate such.
 * The values are dependent on the preferences we got as an input,
 * as we don't know the actual size of the data stream.
 *
 * The `defaultSliceSize` parameter can be used to set how large a slice should be if the end of a range is not defined.
 * Setting this to 0, which is the default, will cause the end of the stream to be used as the end of the slice.
 */
class BinarySliceResourceStore extends PassthroughStore_1.PassthroughStore {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    defaultSliceSize;
    constructor(source, defaultSliceSize = 0) {
        super(source);
        this.defaultSliceSize = defaultSliceSize;
    }
    async getRepresentation(identifier, preferences, conditions) {
        const result = await this.source.getRepresentation(identifier, preferences, conditions);
        if (!preferences.range || preferences.range.unit !== 'bytes' || preferences.range.parts.length === 0) {
            return result;
        }
        if (result.metadata.has(Vocabularies_1.SOLID_HTTP.unit)) {
            this.logger.debug('Not slicing stream that has already been sliced.');
            return result;
        }
        if (!result.binary) {
            throw new InternalServerError_1.InternalServerError('Trying to slice a non-binary stream.');
        }
        if (preferences.range.parts.length > 1) {
            throw new RangeNotSatisfiedHttpError_1.RangeNotSatisfiedHttpError('Multipart range requests are not supported.');
        }
        let [{ start, end }] = preferences.range.parts;
        const size = (0, QuadUtil_1.termToInt)(result.metadata.get(Vocabularies_1.POSIX.terms.size));
        // Set the default end size if not set already
        if (this.defaultSliceSize > 0 && typeof end !== 'number' && typeof size === 'number' && start >= 0) {
            end = Math.min(size, start + this.defaultSliceSize) - 1;
        }
        result.metadata.set(Vocabularies_1.SOLID_HTTP.terms.unit, preferences.range.unit);
        result.metadata.set(Vocabularies_1.SOLID_HTTP.terms.start, (0, TermUtil_1.toLiteral)(start, Vocabularies_1.XSD.terms.integer));
        if (typeof end === 'number') {
            result.metadata.set(Vocabularies_1.SOLID_HTTP.terms.end, (0, TermUtil_1.toLiteral)(end, Vocabularies_1.XSD.terms.integer));
        }
        try {
            // The reason we don't determine the object mode based on the object mode of the parent stream
            // is that `guardedStreamFrom` does not create object streams when inputting streams/buffers.
            // Something to potentially update in the future.
            result.data = (0, GuardedStream_1.guardStream)(new SliceStream_1.SliceStream(result.data, { start, end, size, objectMode: false }));
        }
        catch (error) {
            // Creating the slice stream can throw an error if some of the parameters are unacceptable.
            // Need to make sure the stream is closed in that case.
            result.data.destroy();
            throw error;
        }
        return result;
    }
}
exports.BinarySliceResourceStore = BinarySliceResourceStore;
//# sourceMappingURL=BinarySliceResourceStore.js.map