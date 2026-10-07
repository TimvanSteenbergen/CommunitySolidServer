"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatingDataAccessor = void 0;
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const PassthroughDataAccessor_1 = require("./PassthroughDataAccessor");
/**
 * A ValidatingDataAccessor wraps a DataAccessor such that the data stream is validated while being written.
 * An AtomicDataAccessor can be used to prevent data being written in case validation fails.
 */
class ValidatingDataAccessor extends PassthroughDataAccessor_1.PassthroughDataAccessor {
    validator;
    constructor(accessor, validator) {
        super(accessor);
        this.validator = validator;
    }
    async writeDocument(identifier, data, metadata) {
        const pipedRep = await this.validator.handleSafe({
            representation: new BasicRepresentation_1.BasicRepresentation(data, metadata),
            identifier,
        });
        return this.accessor.writeDocument(identifier, pipedRep.data, metadata);
    }
    async writeContainer(identifier, metadata) {
        // A container's data mainly resides in its metadata,
        // of which we can't calculate the disk size of at this point in the code.
        // Extra info can be found here: https://github.com/CommunitySolidServer/CommunitySolidServer/pull/973#discussion_r723376888
        return this.accessor.writeContainer(identifier, metadata);
    }
}
exports.ValidatingDataAccessor = ValidatingDataAccessor;
//# sourceMappingURL=ValidatingDataAccessor.js.map