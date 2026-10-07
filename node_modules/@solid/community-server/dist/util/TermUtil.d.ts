import type { Literal, NamedNode, Term } from '@rdfjs/types';
/**
 * @param input - Checks if this is a {@link Term}.
 */
export declare function isTerm(input?: unknown): input is Term;
/**
 * Converts a string to a named node when needed.
 *
 * @param subject - Subject to potentially transform.
 */
export declare function toNamedTerm(subject: string): NamedNode;
export declare function toNamedTerm<T extends Term>(subject: T): T;
export declare function toNamedTerm<T extends Term>(subject: T | string): T | NamedNode;
export declare const toPredicateTerm: typeof toNamedTerm;
/**
 * Converts an object term when needed.
 *
 * @param object - Object to potentially transform.
 * @param preferLiteral - Whether strings are converted to literals or named nodes.
 */
export declare function toObjectTerm(object: string, preferLiteral?: boolean): NamedNode;
export declare function toObjectTerm<T extends Term>(object: T, preferLiteral?: boolean): T;
export declare function toObjectTerm<T extends Term>(object: T | string, preferLiteral?: boolean): T | NamedNode;
/**
 * Creates a literal by first converting the dataType string to a named node.
 *
 * @param object - Object value.
 * @param dataType - Object data type (as string).
 */
export declare function toLiteral(object: string | number, dataType: NamedNode): Literal;
