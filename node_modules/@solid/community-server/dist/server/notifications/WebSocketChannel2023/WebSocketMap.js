"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketMap = void 0;
const WrappedSetMultiMap_1 = require("../../../util/map/WrappedSetMultiMap");
/**
 * A {@link SetMultiMap} linking identifiers to a set of WebSockets.
 * An extension of {@link WrappedSetMultiMap} to make sure Components.js allows us to create this in the config,
 * as {@link WrappedSetMultiMap} has a constructor not supported.
 */
class WebSocketMap extends WrappedSetMultiMap_1.WrappedSetMultiMap {
}
exports.WebSocketMap = WebSocketMap;
//# sourceMappingURL=WebSocketMap.js.map