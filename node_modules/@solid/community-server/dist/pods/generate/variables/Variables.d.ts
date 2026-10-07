export declare const TEMPLATE: import("../../../util/Vocabularies").Vocabulary<"urn:solid-server:template:", "ResourceStore">;
export declare const TEMPLATE_VARIABLE: import("../../../util/Vocabularies").Vocabulary<"urn:solid-server:template:variable:", "baseUrl" | "rootFilePath" | "sparqlEndpoint" | "templateConfig">;
/**
 * Checks if the given variable is one that is supported.
 * This can be used to weed out irrelevant parameters in an object.
 */
export declare function isValidVariable(variable: string): boolean;
