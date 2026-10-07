"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliExtractor = void 0;
const AsyncHandler_1 = require("../../util/handlers/AsyncHandler");
/**
 * Converts the input CLI arguments into an easily parseable key/value object.
 *
 * Due to how the application is built, there are certain CLI parameters
 * that need to be parsed before this class can be instantiated.
 * These can be ignored by this class as they will have been handled before it is called,
 * but that does mean that this class should not error if they are present,
 * e.g., by being strict throwing an error on these unexpected parameters.
 *
 * In case strict mode is preferred, the following should be added to the list of known parameters:
 *  - -c / \--config
 *  - -m / \--mainModulePath
 *  - -l / \--loggingLevel
 */
class CliExtractor extends AsyncHandler_1.AsyncHandler {
}
exports.CliExtractor = CliExtractor;
//# sourceMappingURL=CliExtractor.js.map