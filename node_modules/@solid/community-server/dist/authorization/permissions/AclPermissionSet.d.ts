import type { PermissionSet } from './Permissions';
export declare enum AclMode {
    control = "control"
}
export type AclPermissionSet = PermissionSet & Partial<Record<AclMode, boolean>>;
