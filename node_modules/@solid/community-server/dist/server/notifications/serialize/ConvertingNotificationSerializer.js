"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertingNotificationSerializer = void 0;
const NotificationSerializer_1 = require("./NotificationSerializer");
/**
 * Converts a serialization based on the provided `accept` feature value.
 * In case none was provided no conversion takes place.
 */
class ConvertingNotificationSerializer extends NotificationSerializer_1.NotificationSerializer {
    source;
    converter;
    constructor(source, converter) {
        super();
        this.source = source;
        this.converter = converter;
    }
    async canHandle(input) {
        await this.source.canHandle(input);
    }
    async handle(input) {
        const representation = await this.source.handle(input);
        const type = input.channel.accept;
        if (!type) {
            return representation;
        }
        const preferences = { type: { [type]: 1 } };
        return this.converter.handleSafe({ representation, preferences, identifier: { path: input.notification.id } });
    }
}
exports.ConvertingNotificationSerializer = ConvertingNotificationSerializer;
//# sourceMappingURL=ConvertingNotificationSerializer.js.map