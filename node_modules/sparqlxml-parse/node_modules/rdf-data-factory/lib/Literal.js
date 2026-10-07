"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Literal = void 0;
const NamedNode_1 = require("./NamedNode");
/**
 * A term that represents an RDF literal,
 * containing a string with an optional language tag and optional direction
 * or datatype.
 */
class Literal {
    constructor(value, languageOrDatatype) {
        var _a;
        this.termType = 'Literal';
        this.value = value;
        if (typeof languageOrDatatype === 'string') {
            this.language = languageOrDatatype.toLowerCase();
            this.datatype = Literal.RDF_LANGUAGE_STRING;
            this.direction = '';
        }
        else if (languageOrDatatype) {
            if ('termType' in languageOrDatatype) {
                this.language = '';
                this.datatype = languageOrDatatype;
                this.direction = '';
            }
            else {
                this.language = languageOrDatatype.language.toLowerCase();
                this.datatype = languageOrDatatype.direction ?
                    Literal.RDF_DIRECTIONAL_LANGUAGE_STRING :
                    Literal.RDF_LANGUAGE_STRING;
                this.direction = (_a = languageOrDatatype.direction) !== null && _a !== void 0 ? _a : '';
            }
        }
        else {
            this.language = '';
            this.datatype = Literal.XSD_STRING;
            this.direction = '';
        }
    }
    equals(other) {
        return !!other && other.termType === 'Literal' && other.value === this.value &&
            other.language === this.language &&
            ((other.direction === this.direction) || (!other.direction && this.direction === '')) &&
            this.datatype.equals(other.datatype);
    }
}
exports.Literal = Literal;
// eslint-disable-next-line ts/naming-convention
Literal.RDF_LANGUAGE_STRING = new NamedNode_1.NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString');
// eslint-disable-next-line ts/naming-convention
Literal.RDF_DIRECTIONAL_LANGUAGE_STRING = new NamedNode_1.NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString');
// eslint-disable-next-line ts/naming-convention
Literal.XSD_STRING = new NamedNode_1.NamedNode('http://www.w3.org/2001/XMLSchema#string');
//# sourceMappingURL=Literal.js.map