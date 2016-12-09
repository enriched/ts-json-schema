import { JsonSchema } from './JsonSchema';
/**
 * JSON Schema is ultimately a nested definition system.  The root should always contain the $schema property,
 * but further definitions (typically stored on the object in the 'definitions' key of the root) can simply be
 * something like:
 * {
 *     "type": "string"
 * }
 */
export declare var JSON_SCHEMA_V4: string;
export declare const JsonType: {
    string: string;
    integer: string;
    number: string;
    object: string;
    array: string;
    boolean: string;
    'null': string;
};
export declare const Format: {
    date: string;
    time: string;
    dateTime: string;
    email: string;
    hostname: string;
    ipv4: string;
    ipv6: string;
    regex: string;
    uri: string;
    uuid: string;
};
export declare class JsonSchemaBuilder {
    schema: JsonSchema;
    /**
     * Optionally takes an existing json schema to build on top of
     *
     * @param schema
     */
    constructor(schema?: JsonSchema);
    $ref(reference: string): this;
    id(id: string): this;
    $schema(metaSchema: string): this;
    /**
     * The title of the current schema
     *
     * This is primarily for identification and is not used by
     * validation.
     *
     * @param title
     * @returns
     */
    title(title: string): this;
    description(description: string): this;
    'default'(defaultValue: any): this;
    multipleOf(value: number): this;
    maximum(value: number): this;
    exclusiveMaximum(value: boolean): this;
    minimum(value: number): this;
    exclusiveMinimum(value: boolean): this;
    /**
     * Defines the maximum allowable string length.
     *
     * @param value
     */
    maxLength(value: number): this;
    /**
     * Defines the minimum alloable string length.
     *
     * @param value
     */
    minLength(value: number): this;
    /**
     * String must match the supplied pattern
     *
     * @param regex
     */
    pattern(regex: string): this;
    /**
     * If the array my have additional items
     *
     * If a JSON Schema is supplied then additional items must match it.
     *
     * @param value
     * @returns
     */
    additionalItems(value: boolean | JsonSchema): this;
    /**
     * Items in the array must match the supplied JSON Schema(s)
     *
     * @param value
     * @returns
     */
    items(value: JsonSchema | JsonSchema[]): this;
    /**
     * Maximum number of items in Array
     *
     * @param count
     * @returns
     */
    maxItems(count: number): this;
    /**
     * Minimum number of items in Array
     *
     * @param count
     * @returns
     */
    minItems(count: number): this;
    /**
     * All the items in the array must be unique
     *
     * @param yesOrNo
     * @returns this
     */
    uniqueItems(yesOrNo: boolean): this;
    /**
     * Maximum number of properties in object
     *
     * @param count
     * @returns
     */
    maxProperties(count: number): this;
    /**
     * Minimum number of properties in object
     *
     * @param count
     * @returns
     */
    minProperties(count: number): this;
    /**
     * If the object can have additional properties
     *
     * @param value
     * @returns
     */
    additionalProperties(value: boolean | JsonSchema): this;
    /**
     * Creates a definition witin the json schema
     *
     * Defintions can be referenced in the json schema
     *
     * { definitions: {[definitionName]: { definition }}
     *
     * @param name
     * @param [cb]
     * @returns
     */
    definition(name: string, cb?: SchemaCB): this;
    /**
     * Genrates a property definition at #/properties/${name}
     *
     * A JsonSchema can be passed in as the property definition.  The builder in the proceeding callback will operate
     * on that schema. The passed in schema will replace any previously existing schema for the property.
     *
     * @param {string} name
     * @param {(JsonSchema | PropSchemaCB)} [schema] The schema to use as
     * @param {PropSchemaCB} [cb]
     * @returns
     *
     * @memberOf JsonSchemaBuilder
     */
    property(name: string, schema?: JsonSchema | PropSchemaCB, cb?: PropSchemaCB): this;
    patternProperty(regex: string, cb: (schemaBuidler: JsonSchemaBuilder) => any): this;
    /**
     * Enumerate the acceptable values
     *
     * @param values
     * @returns
     */
    'enum'(values: any[]): this;
    /**
     * Sets the type of the schema
     */
    type(type: string | string[]): this;
    /**
     * Adds the specified type to the schema
     *
     * If there is already a type set on the schema then the passed in type
     * is added to the array of types if it is not already present
     *
     * @param type
     */
    canBeType(type: string): void;
    /**
     * Adds the "string" type to the schema
     */
    canBeString(): this;
    /**
     * Adds the "integer" type to the schema
     */
    canBeInteger(): this;
    /**
     * Adds the "number" type to the schema
     */
    canBeNumber(): this;
    /**
     * Adds the "object" type to the schema
     */
    canBeObject(): this;
    /**
     * Adds the "array" type to the schema
     */
    canBeArray(): this;
    /**
     * Adds the "boolean" type to the schema
     */
    canBeBoolean(): this;
    /**
     * Adds the "null" type to the schema
     */
    canBeNull(): this;
    format(format: string): this;
    allOf(schemas: JsonSchema[]): this;
    anyOf(schemas: JsonSchema[]): this;
    oneOf(schemas: JsonSchema[]): this;
    not(schema: JsonSchema): this;
    build(): JsonSchema;
}
export declare class JsonSchemaPropertyBuilder extends JsonSchemaBuilder {
    parentSchema: JsonSchema;
    propertyKey: string;
    constructor(property: string, parentSchema: any);
    required(): this;
    dependency(dependsOn: string[] | JsonSchema): void;
}
export interface SchemaCB {
    (schemaBuidler: JsonSchemaBuilder): any;
}
export interface PropSchemaCB {
    (propertyBuilder: JsonSchemaPropertyBuilder): any;
}
