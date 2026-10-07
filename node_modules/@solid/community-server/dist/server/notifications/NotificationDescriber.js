"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDescriber = void 0;
const arrayify_stream_1 = __importDefault(require("arrayify-stream"));
const n3_1 = require("n3");
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const ContentTypes_1 = require("../../util/ContentTypes");
const Vocabularies_1 = require("../../util/Vocabularies");
const StorageDescriber_1 = require("../description/StorageDescriber");
const { namedNode, quad } = n3_1.DataFactory;
/**
 * Outputs quads describing all the subscription services of the server,
 * as described in https://solidproject.org/TR/2022/notifications-protocol-20221231#discovery and
 * https://solidproject.org/TR/2022/notifications-protocol-20221231#description-resource-data-model.
 *
 * In the future, if there is ever a need to add notification channels to the description resource as described above,
 * this functionality should probably be added here as well.
 */
class NotificationDescriber extends StorageDescriber_1.StorageDescriber {
    converter;
    subscriptions;
    constructor(converter, subscriptions) {
        super();
        this.converter = converter;
        this.subscriptions = subscriptions;
    }
    async handle(identifier) {
        const subject = namedNode(identifier.path);
        const subscriptionLinks = [];
        const preferences = { type: { [ContentTypes_1.INTERNAL_QUADS]: 1 } };
        const subscriptionQuads = await Promise.all(this.subscriptions.map(async (sub) => {
            const jsonld = sub.getDescription();
            const representation = new BasicRepresentation_1.BasicRepresentation(JSON.stringify(jsonld), { path: jsonld.id }, ContentTypes_1.APPLICATION_LD_JSON);
            const converted = await this.converter.handleSafe({ identifier, representation, preferences });
            const arr = await (0, arrayify_stream_1.default)(converted.data);
            subscriptionLinks.push(quad(subject, Vocabularies_1.NOTIFY.terms.subscription, namedNode(jsonld.id)));
            return arr;
        }));
        return [
            ...subscriptionLinks,
            ...subscriptionQuads.flat(),
        ];
    }
}
exports.NotificationDescriber = NotificationDescriber;
//# sourceMappingURL=NotificationDescriber.js.map