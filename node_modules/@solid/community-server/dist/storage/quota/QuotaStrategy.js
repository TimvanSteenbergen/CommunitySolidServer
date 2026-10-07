"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotaStrategy = void 0;
// These two eslint lines are needed to store 'this' in a variable so it can be used
// in the PassThrough of createQuotaGuard
const node_stream_1 = require("node:stream");
const PayloadHttpError_1 = require("../../util/errors/PayloadHttpError");
const GuardedStream_1 = require("../../util/GuardedStream");
/**
 * A QuotaStrategy is used when we want to set a limit to the amount of data that can be
 * stored on the server.
 * This can range from a limit for the whole server to a limit on a per pod basis.
 * The way the size of a resource is calculated is implemented by the implementing classes.
 * This can be bytes, quads, file count, ...
 */
class QuotaStrategy {
    reporter;
    limit;
    constructor(reporter, limit) {
        this.reporter = reporter;
        this.limit = limit;
    }
    /**
     * Get the available space when writing data to the given identifier.
     * If the given resource already exists it will deduct the already taken up
     * space by that resource since it is going to be overwritten and thus counts
     * as available space.
     *
     * @param identifier - the identifier of the resource of which you want the available space
     *
     * @returns the available space and the unit of the space as a Size object
     */
    async getAvailableSpace(identifier) {
        const totalUsed = await this.getTotalSpaceUsed(identifier);
        // Ignore identifiers where quota does not apply
        if (totalUsed.amount === Number.MAX_SAFE_INTEGER) {
            return totalUsed;
        }
        // When a file is overwritten the space the file takes up right now should also
        // be counted as available space as it will disappear/be overwritten
        totalUsed.amount -= (await this.reporter.getSize(identifier)).amount;
        return {
            amount: this.limit.amount - totalUsed.amount,
            unit: this.limit.unit,
        };
    }
    /**
     * Get an estimated size of the resource
     *
     * @param metadata - the metadata that might include the size
     *
     * @returns a Size object containing the estimated size and unit of the resource
     */
    async estimateSize(metadata) {
        const estimate = await this.reporter.estimateSize(metadata);
        return estimate ? { unit: this.limit.unit, amount: estimate } : undefined;
    }
    /**
     * Get a Passthrough stream that will keep track of the available space.
     * If the quota is exceeded the stream will emit an error and destroy itself.
     * Like other Passthrough instances this will simply pass on the chunks, when the quota isn't exceeded.
     *
     * @param identifier - the identifier of the resource in question
     *
     * @returns a Passthrough instance that errors when quota is exceeded
     */
    async createQuotaGuard(identifier) {
        let total = 0;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        const { reporter } = this;
        return (0, GuardedStream_1.guardStream)(new node_stream_1.PassThrough({
            async transform(chunk, enc, done) {
                total += await reporter.calculateChunkSize(chunk);
                const availableSpace = await that.getAvailableSpace(identifier);
                if (availableSpace.amount < total) {
                    this.destroy(new PayloadHttpError_1.PayloadHttpError(`Quota exceeded by ${total - availableSpace.amount} ${availableSpace.unit} during write`));
                }
                this.push(chunk);
                done();
            },
        }));
    }
}
exports.QuotaStrategy = QuotaStrategy;
//# sourceMappingURL=QuotaStrategy.js.map