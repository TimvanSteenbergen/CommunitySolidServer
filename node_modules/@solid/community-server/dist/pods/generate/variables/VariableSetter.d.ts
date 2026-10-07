import type { PodSettings } from '../../settings/PodSettings';
import { VariableHandler } from './VariableHandler';
/**
 * A VariableHandler that will set the given variable to the given value,
 * unless there already is a value for the variable and override is false.
 */
export declare class VariableSetter extends VariableHandler {
    private readonly variable;
    private readonly value;
    private readonly override;
    constructor(variable: string, value: string, override?: boolean);
    handle({ settings }: {
        settings: PodSettings;
    }): Promise<void>;
}
