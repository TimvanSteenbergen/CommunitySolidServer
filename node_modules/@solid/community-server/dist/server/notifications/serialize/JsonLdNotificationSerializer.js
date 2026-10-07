"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonLdNotificationSerializer = void 0;
const BasicRepresentation_1 = require("../../../http/representation/BasicRepresentation");
const ContentTypes_1 = require("../../../util/ContentTypes");
const NotificationSerializer_1 = require("./NotificationSerializer");
/**
 * Serializes a Notification into a JSON-LD string.
 */
class JsonLdNotificationSerializer extends NotificationSerializer_1.NotificationSerializer {
    async handle({ notification }) {
        return new BasicRepresentation_1.BasicRepresentation(JSON.stringify(notification), ContentTypes_1.APPLICATION_LD_JSON);
    }
}
exports.JsonLdNotificationSerializer = JsonLdNotificationSerializer;
//# sourceMappingURL=JsonLdNotificationSerializer.js.map