import type { Credentials } from './Credentials';
import { CredentialsExtractor } from './CredentialsExtractor';
/**
 * Extracts the "public credentials", to be used for data everyone has access to.
 * This class mainly exists so a {@link Credentials} is still generated in case the token parsing fails.
 */
export declare class PublicCredentialsExtractor extends CredentialsExtractor {
    handle(): Promise<Credentials>;
}
