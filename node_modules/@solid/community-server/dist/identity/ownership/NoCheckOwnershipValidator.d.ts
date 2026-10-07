import { OwnershipValidator } from './OwnershipValidator';
/**
 * Does not do any checks to verify if the agent doing the request is actually the owner of the WebID.
 * This should only be used for debugging.
 */
export declare class NoCheckOwnershipValidator extends OwnershipValidator {
    protected readonly logger: import("../..").Logger;
    handle({ webId }: {
        webId: string;
    }): Promise<void>;
}
