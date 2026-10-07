import { UnionHandler } from '../util/handlers/UnionHandler';
import type { PermissionReader } from './PermissionReader';
import type { PermissionMap } from './permissions/Permissions';
/**
 * Combines the results of multiple PermissionReaders.
 * Every permission in every credential type is handled according to the rule `false` \> `true` \> `undefined`.
 */
export declare class UnionPermissionReader extends UnionHandler<PermissionReader> {
    constructor(readers: PermissionReader[]);
    protected combine(results: PermissionMap[]): Promise<PermissionMap>;
    /**
     * Merges all entries of the given map into the result map.
     */
    private mergePermissionMaps;
    /**
     * Adds the given permissions to the result object according to the combination rules of the class.
     */
    private mergePermissions;
}
