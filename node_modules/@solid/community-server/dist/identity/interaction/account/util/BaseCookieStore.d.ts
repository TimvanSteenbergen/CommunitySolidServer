import type { ExpiringStorage } from '../../../../storage/keyvalue/ExpiringStorage';
import type { CookieStore } from './CookieStore';
/**
 * A {@link CookieStore} that uses an {@link ExpiringStorage} to keep track of the stored cookies.
 * Cookies have a specified time to live in seconds, default is 14 days,
 * after which they will be removed.
 */
export declare class BaseCookieStore implements CookieStore {
    private readonly storage;
    private readonly ttl;
    constructor(storage: ExpiringStorage<string, string>, ttl?: number);
    generate(accountId: string): Promise<string>;
    get(cookie: string): Promise<string | undefined>;
    refresh(cookie: string): Promise<Date | undefined>;
    delete(cookie: string): Promise<boolean>;
}
