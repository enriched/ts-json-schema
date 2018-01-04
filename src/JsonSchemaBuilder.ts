import { JsonSchema } from './JsonSchema';

/**
 * JSON Schema is ultimately a nested definition system.  The root should always contain the $schema property,
 * but further definitions (typically stored on the object in the 'definitions' key of the root) can simply be
 * something like:
 * {
 *     "type": "string"
 * }
 */

export var JSON_SCHEMA_V4 = 'http://json-schema.org/draft-04/schema#';

export const JsonType = {
  string: 'string',
  integer: 'integer',
  number: 'number',
  object: 'object',
  array: 'array',
  boolean: 'boolean',
  null: 'null',
};

export const Format = {
  date: 'date',
  time: 'time',
  dateTime: 'date-time',
  email: 'email',
  hostname: 'hostname',
  ipv4: 'ipv4',
  ipv6: 'ipv6',
  regex: 'regex',
  uri: 'uri',
  uuid: 'uuid',
};

export class JsonSchemaBuilder {
  schema: JsonSchema = {};

  /**
   * Optionally takes an existing json schema to build on top of
   *
   * @param schema
   */
  constructor(schema?: JsonSchema) {
    this.schema = schema == null ? ({} as JsonSchema) : schema;
  }

  /////////////////////////////////////////////////////////////////////////////
  // Reference
  /////////////////////////////////////////////////////////////////////////////

  $ref(reference: string) {
    this.schema.$ref = reference;
    return this;
  }

  /////////////////////////////////////////////////////////////////////////////
  // Metadata
  /////////////////////////////////////////////////////////////////////////////

  id(id: string) {
    this.schema.id = id;
    return this;
  }

  $schema(metaSchema: string) {
    this.schema.$schema = metaSchema;
    return this;
  }

  /**
   * The title of the current schema
   *
   * This is primarily for identification and is not used by
   * validation.
   *
   * @param title
   * @returns
   */
  title(title: string) {
    this.schema.title = title;
    return this;
  }

  description(description: string) {
    this.schema.description = description;
    return this;
  }

  default(defaultValue: any) {
    this.schema.default = defaultValue;
    return this;
  }

  // Number Validation

  multipleOf(value: number) {
    this.schema.multipleOf = value;
    return this;
  }

  maximum(value: number) {
    this.schema.maximum = value;
    return this;
  }

  exclusiveMaximum(value: boolean) {
    this.schema.exclusiveMaximum = value;
    return this;
  }

  minimum(value: number) {
    this.schema.minimum = value;
    return this;
  }

  exclusiveMinimum(value: boolean) {
    this.schema.exclusiveMinimum = value;
    return this;
  }

  /////////////////////////////////////////////////////////////////////////////
  // String Validation
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Defines the maximum allowable string length.
   *
   * @param value
   */
  maxLength(value: number) {
    this.schema.maxLength = value;
    return this;
  }

  /**
   * Defines the minimum alloable string length.
   *
   * @param value
   */
  minLength(value: number) {
    this.schema.minLength = value;
    return this;
  }

  /**
   * String must match the supplied pattern
   *
   * @param regex
   */
  pattern(regex: string) {
    this.schema.pattern = regex;
    return this;
  }

  /////////////////////////////////////////////////////////////////////////////
  // Array Validation
  /////////////////////////////////////////////////////////////////////////////

  /**
   * If the array my have additional items
   *
   * If a JSON Schema is supplied then additional items must match it.
   *
   * @param value
   * @returns
   */
  additionalItems(value: boolean | JsonSchema) {
    this.schema.additionalItems = value;
    return this;
  }

  /**
   * Items in the array must match the supplied JSON Schema(s)
   *
   * @param value
   * @returns
   */
  items(value: JsonSchema | JsonSchema[]) {
    this.schema.items = value;
    return this;
  }

  /**
   * Maximum number of items in Array
   *
   * @param count
   * @returns
   */
  maxItems(count: number) {
    this.schema.maxItems = count;
    return this;
  }

  /**
   * Minimum number of items in Array
   *
   * @param count
   * @returns
   */
  minItems(count: number) {
    this.schema.minItems = count;
    return this;
  }

  /**
   * All the items in the array must be unique
   *
   * @param yesOrNo
   * @returns this
   */
  uniqueItems(yesOrNo: boolean) {
    this.schema.uniqueItems = yesOrNo;
    return this;
  }

  // Object Validation

  /**
   * Maximum number of properties in object
   *
   * @param count
   * @returns
   */
  maxProperties(count: number) {
    this.schema.maxProperties = count;
    return this;
  }

  /**
   * Minimum number of properties in object
   *
   * @param count
   * @returns
   */
  minProperties(count: number) {
    this.schema.minProperties = count;
    return this;
  }

  /**
   * If the object can have additional properties
   *
   * @param value
   * @returns
   */
  additionalProperties(value: boolean | JsonSchema) {
    this.schema.additionalProperties = value;
    return this;
  }

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
  definition(name: string, cb?: SchemaCB) {
    if (!this.schema.definitions) {
      this.schema.definitions = {};
    }
    var definition;
    if (!this.schema.definitions[name]) {
      definition = {};
      this.schema.definitions[name] = definition;
    } else {
      definition = this.schema.definitions[name];
    }
    if (cb) {
      cb(new JsonSchemaBuilder(definition));
    }
    return this;
  }

  /**
   * Genrates a property definition at #/properties/${name}
   *
   * A JsonSchema can be passed in as the property definition.  The builder in the proceeding callback will operate
   * on that schema. The passed in schema will replace any previously existing schema for the property.
   *
   * @param {(string | string[])} path
   * @param {(JsonSchema | PropSchemaCB)} [schema] The schema to use as
   * @param {PropSchemaCB} [cb]
   * @returns
   *
   * @memberOf JsonSchemaBuilder
   */
  property(
    path: string | string[],
    schema?: JsonSchema | PropSchemaCB,
    cb?: PropSchemaCB,
  ) {
    var propBuilder: JsonSchemaPropertyBuilder;
    let rootSchema: JsonSchema = this.schema;
    let rootSchemaProperty: string;
    if (Array.isArray(path)) {
      rootSchemaProperty = path[path.length - 1];
      for (let i = 1; i < path.length; i++) {
        const propPath = path[i - 1];
        if (!rootSchema.properties) {
          rootSchema.properties = {};
        }
        if (!rootSchema.properties[propPath]) {
          rootSchema.properties[propPath] = {};
        }
        rootSchema = rootSchema.properties[propPath];
      }
    } else {
      rootSchemaProperty = path;
    }
    if (typeof schema === 'function') {
      cb = <PropSchemaCB>schema;
    } else if (schema) {
      rootSchema.properties[rootSchemaProperty] = schema;
    }
    propBuilder = new JsonSchemaPropertyBuilder(rootSchemaProperty, rootSchema);
    if (cb) {
      cb(propBuilder);
    }
    propBuilder.build();
    return this;
  }

  /////////////////////////////////////////////////////////////////////////////
  // Generic
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Enumerate the acceptable values
   *
   * @param values
   * @returns
   */
  enum(values: any[]) {
    this.schema.enum = values;
    return this;
  }

  /**
   * Sets the type of the schema
   */
  type(type: string | string[]) {
    this.schema.type = type;
    return this;
  }

  /**
   * Adds the specified type to the schema
   *
   * If there is already a type set on the schema then the passed in type
   * is added to the array of types if it is not already present
   *
   * @param type
   */
  canBeType(type: string) {
    if (!this.schema.type) {
      this.schema.type = type;
    } else if (Array.isArray(this.schema.type)) {
      if (this.schema.type.indexOf(type) === -1) {
        this.schema.type.push(type);
      }
    } else {
      this.schema.type = [this.schema.type, type];
    }
  }

  /**
   * Adds the "string" type to the schema
   */
  canBeString() {
    this.canBeType(JsonType.string);
    return this;
  }

  /**
   * Adds the "integer" type to the schema
   */
  canBeInteger() {
    this.canBeType(JsonType.integer);
    return this;
  }

  /**
   * Adds the "number" type to the schema
   */
  canBeNumber() {
    this.canBeType(JsonType.number);
    return this;
  }

  /**
   * Adds the "object" type to the schema
   */
  canBeObject() {
    this.canBeType(JsonType.object);
    return this;
  }

  /**
   * Adds the "array" type to the schema
   */
  canBeArray() {
    this.canBeType(JsonType.array);
    return this;
  }

  /**
   * Adds the "boolean" type to the schema
   */
  canBeBoolean() {
    this.canBeType(JsonType.boolean);
    return this;
  }

  /**
   * Adds the "null" type to the schema
   */
  canBeNull() {
    this.canBeType(JsonType.null);
    return this;
  }

  format(format: string) {
    this.schema.format = format;
    return this;
  }

  /////////////////////////////////////////////////////////////////////////////
  // Schema Composition (Cobining Schemas)
  /////////////////////////////////////////////////////////////////////////////

  allOf(schemas: JsonSchema[]) {
    if (!this.schema.allOf) {
      this.schema.allOf = [];
    }
    this.schema.allOf = this.schema.allOf.concat(schemas);
    return this;
  }

  anyOf(schemas: JsonSchema[]) {
    if (!this.schema.anyOf) {
      this.schema.anyOf = [];
    }
    this.schema.anyOf = this.schema.anyOf.concat(schemas);
    return this;
  }

  oneOf(schemas: JsonSchema[]) {
    if (!this.schema.oneOf) {
      this.schema.oneOf = [];
    }
    this.schema.oneOf = this.schema.oneOf.concat(schemas);
    return this;
  }

  not(schema: JsonSchema) {
    this.schema.not = schema;
    return this;
  }

  build(): JsonSchema {
    return this.schema;
  }
}

export class JsonSchemaPropertyBuilder extends JsonSchemaBuilder {
  parentSchema: JsonSchema;
  propertyKey: string;

  constructor(property: string, parentSchema: any) {
    if (!parentSchema.properties) {
      parentSchema.properties = {};
    }
    var thisSchema;
    if (!parentSchema.properties[property]) {
      thisSchema = {};
      parentSchema.properties[property] = thisSchema;
    } else {
      thisSchema = parentSchema.properties[property];
    }
    super(thisSchema);
    this.propertyKey = property;
    this.parentSchema = parentSchema;
  }

  required() {
    if (!this.parentSchema.required) {
      this.parentSchema.required = [];
    }
    this.parentSchema.required.push(this.propertyKey);
    return this;
  }

  dependency(dependsOn: string[] | JsonSchema) {
    var property = this.propertyKey;
    if (!this.parentSchema.dependencies) {
      this.parentSchema.dependencies = {};
    }
    if (dependsOn instanceof Array) {
      if (!this.parentSchema.dependencies[property]) {
        this.parentSchema.dependencies[property] = [];
      }
      (this.parentSchema.dependencies[property] as Array<string>).concat(
        dependsOn,
      );
    } else {
      this.parentSchema.dependencies[property] = dependsOn;
    }
  }
}

export interface SchemaCB {
  (schemaBuidler: JsonSchemaBuilder): void;
}

export interface PropSchemaCB {
  (propertyBuilder: JsonSchemaPropertyBuilder): void;
}
