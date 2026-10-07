import type { Size } from '../size-reporter/Size';
import type { SizeReporter } from '../size-reporter/SizeReporter';
import { QuotaStrategy } from './QuotaStrategy';
/**
 * The GlobalQuotaStrategy sets a limit on the amount of data stored on the server globally.
 */
export declare class GlobalQuotaStrategy extends QuotaStrategy {
    private readonly base;
    constructor(limit: Size, reporter: SizeReporter<unknown>, base: string);
    protected getTotalSpaceUsed(): Promise<Size>;
}
