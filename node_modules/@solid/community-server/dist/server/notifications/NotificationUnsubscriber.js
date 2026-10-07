"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationUnsubscriber = void 0;
const ResetResponseDescription_1 = require("../../http/output/response/ResetResponseDescription");
const LogUtil_1 = require("../../logging/LogUtil");
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const OperationHttpHandler_1 = require("../OperationHttpHandler");
/**
 * Allows clients to unsubscribe from notification channels.
 * Should be wrapped in a route handler that only allows `DELETE` operations.
 */
class NotificationUnsubscriber extends OperationHttpHandler_1.OperationHttpHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    storage;
    constructor(storage) {
        super();
        this.storage = storage;
    }
    async handle({ operation }) {
        const id = operation.target.path;
        const existed = await this.storage.delete(id);
        if (!existed) {
            throw new NotFoundHttpError_1.NotFoundHttpError();
        }
        this.logger.debug(`Deleted notification channel ${id}`);
        return new ResetResponseDescription_1.ResetResponseDescription();
    }
}
exports.NotificationUnsubscriber = NotificationUnsubscriber;
//# sourceMappingURL=NotificationUnsubscriber.js.map