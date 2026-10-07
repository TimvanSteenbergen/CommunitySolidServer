import { AsyncHandler } from './AsyncHandler';
type InType = {
    method: string;
} | {
    request: {
        method: string;
    };
} | {
    operation: {
        method: string;
    };
};
/**
 * Only accepts requests where the input has a (possibly nested) `method` field
 * that matches any one of the given methods.
 * In case of a match, the input will be sent to the source handler.
 */
export declare class MethodFilterHandler<TIn extends InType, TOut> extends AsyncHandler<TIn, TOut> {
    private readonly methods;
    private readonly source;
    constructor(methods: string[], source: AsyncHandler<TIn, TOut>);
    canHandle(input: TIn): Promise<void>;
    handle(input: TIn): Promise<TOut>;
    /**
     * Finds the correct method in the input object.
     */
    private findMethod;
}
export {};
