/**
 * Helper class for instantiating multiple objects with Components.js.
 * See https://github.com/LinkedSoftwareDependencies/Components.js/issues/26
 */
export declare class RecordObject implements Record<string, unknown> {
    constructor(record?: Record<string, unknown>);
    [key: string]: unknown;
}
