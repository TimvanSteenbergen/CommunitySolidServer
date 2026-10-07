"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliceStream = void 0;
const node_stream_1 = require("node:stream");
const RangeNotSatisfiedHttpError_1 = require("./errors/RangeNotSatisfiedHttpError");
const StreamUtil_1 = require("./StreamUtil");
/**
 * A stream that slices a part out of another stream.
 * `start` and `end` are inclusive.
 * If `end` is not defined it is until the end of the stream.
 *
 * Negative `start` values can be used to instead slice that many streams off the end of the stream.
 * This requires the `size` field to be defined.
 *
 * Both object and non-object streams are supported.
 * This needs to be explicitly specified,
 * as the class makes no assumptions based on the object mode of the source stream.
 */
class SliceStream extends node_stream_1.Transform {
    source;
    remainingSkip;
    remainingRead;
    constructor(source, options) {
        super(options);
        let start = options.start;
        const end = options.end ?? Number.POSITIVE_INFINITY;
        if (options.start < 0) {
            if (typeof options.size === 'number') {
                // `start` is a negative number here so need to add
                start = options.size + start;
            }
            else {
                throw new RangeNotSatisfiedHttpError_1.RangeNotSatisfiedHttpError('Slicing data at the end of a stream requires a known size.');
            }
        }
        if (start >= end) {
            throw new RangeNotSatisfiedHttpError_1.RangeNotSatisfiedHttpError('Range start should be less than end.');
        }
        // Not using `end` variable as that could be infinity
        if (typeof options.end === 'number' && typeof options.size === 'number' && options.end >= options.size) {
            throw new RangeNotSatisfiedHttpError_1.RangeNotSatisfiedHttpError('Range end should be less than the total size.');
        }
        this.remainingSkip = start;
        // End value is inclusive
        this.remainingRead = end - options.start + 1;
        this.source = source;
        (0, StreamUtil_1.pipeSafely)(source, this);
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _transform(chunk, encoding, callback) {
        this.source.pause();
        if (this.writableObjectMode) {
            this.objectSlice(chunk);
        }
        else {
            this.binarySlice(chunk);
        }
        this.source.resume();
        callback();
    }
    binarySlice(chunk) {
        let length = chunk.length;
        if (this.remainingSkip > 0) {
            chunk = chunk.subarray(this.remainingSkip);
            this.remainingSkip -= length - chunk.length;
            length = chunk.length;
        }
        if (length > 0 && this.remainingSkip <= 0) {
            chunk = chunk.subarray(0, this.remainingRead);
            this.push(chunk);
            this.remainingRead -= length;
            this.checkEnd();
        }
    }
    objectSlice(chunk) {
        if (this.remainingSkip > 0) {
            this.remainingSkip -= 1;
        }
        else {
            this.remainingRead -= 1;
            this.push(chunk);
            this.checkEnd();
        }
    }
    /**
     * Stop piping the source stream and close everything once the slice is finished.
     */
    checkEnd() {
        if (this.remainingRead <= 0) {
            this.source.unpipe();
            this.end();
            this.source.destroy();
        }
    }
}
exports.SliceStream = SliceStream;
//# sourceMappingURL=SliceStream.js.map