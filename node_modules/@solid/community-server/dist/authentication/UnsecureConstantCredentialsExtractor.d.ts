import type { Credentials } from './Credentials';
import { CredentialsExtractor } from './CredentialsExtractor';
/**
 * Credentials extractor that authenticates a constant agent
 * (useful for development or debugging purposes).
 */
export declare class UnsecureConstantCredentialsExtractor extends CredentialsExtractor {
    private readonly credentials;
    private readonly logger;
    constructor(agent: string);
    constructor(agent: Credentials['agent']);
    handle(): Promise<Credentials>;
}
