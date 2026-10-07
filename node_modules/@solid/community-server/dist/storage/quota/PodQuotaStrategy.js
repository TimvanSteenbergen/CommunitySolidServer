"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodQuotaStrategy = void 0;
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const Vocabularies_1 = require("../../util/Vocabularies");
const QuotaStrategy_1 = require("./QuotaStrategy");
/**
 * The PodQuotaStrategy sets a limit on the amount of data stored on a per pod basis
 */
class PodQuotaStrategy extends QuotaStrategy_1.QuotaStrategy {
    identifierStrategy;
    accessor;
    constructor(limit, reporter, identifierStrategy, accessor) {
        super(reporter, limit);
        this.identifierStrategy = identifierStrategy;
        this.accessor = accessor;
    }
    async getTotalSpaceUsed(identifier) {
        const pimStorage = await this.searchPimStorage(identifier);
        // No storage was found containing this identifier, so we assume this identifier points to an internal location.
        // Quota does not apply here so there is always available space.
        if (!pimStorage) {
            return { amount: Number.MAX_SAFE_INTEGER, unit: this.limit.unit };
        }
        return this.reporter.getSize(pimStorage);
    }
    /** Finds the closest parent container that has pim:storage as metadata */
    async searchPimStorage(identifier) {
        if (this.identifierStrategy.isRootContainer(identifier)) {
            return;
        }
        let metadata;
        const parent = this.identifierStrategy.getParentContainer(identifier);
        try {
            metadata = await this.accessor.getMetadata(identifier);
        }
        catch (error) {
            if (error instanceof NotFoundHttpError_1.NotFoundHttpError) {
                // Resource and/or its metadata do not exist
                return this.searchPimStorage(parent);
            }
            throw error;
        }
        const hasPimStorageMetadata = metadata.getAll(Vocabularies_1.RDF.terms.type)
            .some((term) => term.value === Vocabularies_1.PIM.Storage);
        return hasPimStorageMetadata ? identifier : this.searchPimStorage(parent);
    }
}
exports.PodQuotaStrategy = PodQuotaStrategy;
//# sourceMappingURL=PodQuotaStrategy.js.map