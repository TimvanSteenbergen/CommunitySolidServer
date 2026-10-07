import type { PermissionReaderInput } from './PermissionReader';
import { PermissionReader } from './PermissionReader';
import type { PermissionMap } from './permissions/Permissions';
/**
 * PermissionReader which sets all permissions to true or false
 * independently of the identifier and requested permissions.
 */
export declare class AllStaticReader extends PermissionReader {
    private readonly permissionSet;
    constructor(allow: boolean);
    handle({ requestedModes }: PermissionReaderInput): Promise<PermissionMap>;
}
