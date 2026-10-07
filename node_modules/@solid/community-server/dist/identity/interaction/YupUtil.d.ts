import type { AnyObject, Maybe, ObjectSchema, ValidateOptions } from 'yup';
type BaseObjectSchema = ObjectSchema<Maybe<AnyObject>>;
export declare const URL_SCHEMA: import("yup").StringSchema<string | undefined, AnyObject, undefined, "">;
type SchemaType<T> = T extends BaseObjectSchema ? ObjectType<T> : {
    required: boolean;
    type: string;
};
type FieldType<T extends BaseObjectSchema> = T extends {
    fields: Record<infer R, unknown>;
} ? R : never;
type ObjectType<T extends BaseObjectSchema> = {
    required: boolean;
    type: 'object';
    fields: {
        [K in FieldType<T>]: SchemaType<T['fields'][K]>;
    };
};
/**
 * Generates a simplified representation of a yup schema.
 */
export declare function parseSchema<T extends BaseObjectSchema>(schema: T): Pick<SchemaType<T>, 'fields'>;
/**
 * Same functionality as the yup validate function, but throws a {@link BadRequestHttpError} if there is an error.
 */
export declare function validateWithError<T extends BaseObjectSchema>(schema: T, data: unknown, options?: ValidateOptions<AnyObject>): Promise<T['__outputType']>;
export {};
