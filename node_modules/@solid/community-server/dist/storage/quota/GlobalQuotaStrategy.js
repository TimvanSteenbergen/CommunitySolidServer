"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalQuotaStrategy = void 0;
const QuotaStrategy_1 = require("./QuotaStrategy");
/**
 * The GlobalQuotaStrategy sets a limit on the amount of data stored on the server globally.
 */
class GlobalQuotaStrategy extends QuotaStrategy_1.QuotaStrategy {
    base;
    constructor(limit, reporter, base) {
        super(reporter, limit);
        this.base = base;
    }
    async getTotalSpaceUsed() {
        return this.reporter.getSize({ path: this.base });
    }
}
exports.GlobalQuotaStrategy = GlobalQuotaStrategy;
//# sourceMappingURL=GlobalQuotaStrategy.js.map