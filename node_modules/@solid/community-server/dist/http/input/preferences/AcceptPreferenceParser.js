"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptPreferenceParser = void 0;
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const PreferenceParser_1 = require("./PreferenceParser");
const parsers = [
    { name: 'type', header: 'accept', parse: HeaderUtil_1.parseAccept },
    { name: 'charset', header: 'accept-charset', parse: HeaderUtil_1.parseAcceptCharset },
    { name: 'encoding', header: 'accept-encoding', parse: HeaderUtil_1.parseAcceptEncoding },
    { name: 'language', header: 'accept-language', parse: HeaderUtil_1.parseAcceptLanguage },
    { name: 'datetime', header: 'accept-datetime', parse: HeaderUtil_1.parseAcceptDateTime },
];
/**
 * Extracts preferences from the Accept-* headers from an incoming {@link HttpRequest}.
 * Supports Accept, Accept-Charset, Accept-Encoding, Accept-Language and Accept-DateTime.
 */
class AcceptPreferenceParser extends PreferenceParser_1.PreferenceParser {
    async handle({ request: { headers } }) {
        const preferences = {};
        for (const { name, header, parse } of parsers) {
            const value = headers[header];
            if (typeof value === 'string') {
                const result = Object.fromEntries(parse(value)
                    .map(({ range, weight }) => [range, weight]));
                // Interpret empty headers (or headers with no valid values) the same as missing headers
                if (Object.keys(result).length > 0) {
                    preferences[name] = result;
                }
            }
        }
        return preferences;
    }
}
exports.AcceptPreferenceParser = AcceptPreferenceParser;
//# sourceMappingURL=AcceptPreferenceParser.js.map