"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotaValidator = void 0;
const node_stream_1 = require("node:stream");
const Validator_1 = require("../../http/auxiliary/Validator");
const PayloadHttpError_1 = require("../../util/errors/PayloadHttpError");
const GuardedStream_1 = require("../../util/GuardedStream");
const StreamUtil_1 = require("../../util/StreamUtil");
/**
 * The QuotaValidator validates data streams by making sure they would not exceed the limits of a QuotaStrategy.
 */
class QuotaValidator extends Validator_1.Validator {
    strategy;
    constructor(strategy) {
        super();
        this.strategy = strategy;
    }
    async handle({ representation, identifier }) {
        const { data, metadata } = representation;
        // 1. Get the available size
        const availableSize = await this.strategy.getAvailableSpace(identifier);
        // 2. Check if the estimated size is bigger then the available size
        const estimatedSize = await this.strategy.estimateSize(metadata);
        if (estimatedSize && availableSize.amount < estimatedSize.amount) {
            return {
                ...representation,
                data: (0, GuardedStream_1.guardStream)(new node_stream_1.Readable({
                    read() {
                        this.destroy(new PayloadHttpError_1.PayloadHttpError(`Quota exceeded: Advertised Content-Length is ${estimatedSize.amount} ${estimatedSize.unit} ` +
                            `and only ${availableSize.amount} ${availableSize.unit} is available`));
                    },
                })),
            };
        }
        // 3. Track if quota is exceeded during writing
        const tracking = await this.strategy.createQuotaGuard(identifier);
        // 4. Double check quota is not exceeded after write (concurrent writing possible)
        const afterWrite = new node_stream_1.PassThrough({
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            flush: async (done) => {
                const availableSpace = (await this.strategy.getAvailableSpace(identifier)).amount;
                done(availableSpace < 0 ? new PayloadHttpError_1.PayloadHttpError('Quota exceeded after write completed') : undefined);
            },
        });
        return {
            ...representation,
            data: (0, StreamUtil_1.pipeSafely)((0, StreamUtil_1.pipeSafely)(data, tracking), afterWrite),
        };
    }
}
exports.QuotaValidator = QuotaValidator;
//# sourceMappingURL=QuotaValidator.js.map