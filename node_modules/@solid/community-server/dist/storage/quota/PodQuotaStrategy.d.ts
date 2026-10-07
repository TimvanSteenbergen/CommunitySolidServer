import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { IdentifierStrategy } from '../../util/identifiers/IdentifierStrategy';
import type { DataAccessor } from '../accessors/DataAccessor';
import type { Size } from '../size-reporter/Size';
import type { SizeReporter } from '../size-reporter/SizeReporter';
import { QuotaStrategy } from './QuotaStrategy';
/**
 * The PodQuotaStrategy sets a limit on the amount of data stored on a per pod basis
 */
export declare class PodQuotaStrategy extends QuotaStrategy {
    private readonly identifierStrategy;
    private readonly accessor;
    constructor(limit: Size, reporter: SizeReporter<unknown>, identifierStrategy: IdentifierStrategy, accessor: DataAccessor);
    protected getTotalSpaceUsed(identifier: ResourceIdentifier): Promise<Size>;
    /** Finds the closest parent container that has pim:storage as metadata */
    private searchPimStorage;
}
