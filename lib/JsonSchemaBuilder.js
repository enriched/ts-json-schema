"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * JSON Schema is ultimately a nested definition system.  The root should always contain the $schema property,
 * but further definitions (typically stored on the object in the 'definitions' key of the root) can simply be
 * something like:
 * {
 *     "type": "string"
 * }
 */
exports.JSON_SCHEMA_V4 = 'http://json-schema.org/draft-04/schema#';
exports.JsonType = {
    string: 'string',
    integer: 'integer',
    number: 'number',
    object: 'object',
    array: 'array',
    boolean: 'boolean',
    'null': 'null',
};
exports.Format = {
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
var JsonSchemaBuilder = (function () {
    /**
     * Optionally takes an existing json schema to build on top of
     *
     * @param schema
     */
    function JsonSchemaBuilder(schema) {
        this.schema = {};
        this.schema = schema == null ? {} : schema;
    }
    /////////////////////////////////////////////////////////////////////////////
    // Reference
    /////////////////////////////////////////////////////////////////////////////
    JsonSchemaBuilder.prototype.$ref = function (reference) {
        this.schema.$ref = reference;
        return this;
    };
    /////////////////////////////////////////////////////////////////////////////
    // Metadata
    /////////////////////////////////////////////////////////////////////////////
    JsonSchemaBuilder.prototype.id = function (id) {
        this.schema.id = id;
        return this;
    };
    JsonSchemaBuilder.prototype.$schema = function (metaSchema) {
        this.schema.$schema = metaSchema;
        return this;
    };
    /**
     * The title of the current schema
     *
     * This is primarily for identification and is not used by
     * validation.
     *
     * @param title
     * @returns
     */
    JsonSchemaBuilder.prototype.title = function (title) {
        this.schema.title = title;
        return this;
    };
    JsonSchemaBuilder.prototype.description = function (description) {
        this.schema.description = description;
        return this;
    };
    JsonSchemaBuilder.prototype['default'] = function (defaultValue) {
        this.schema.default = defaultValue;
        return this;
    };
    // Number Validation
    JsonSchemaBuilder.prototype.multipleOf = function (value) {
        this.schema.multipleOf = value;
        return this;
    };
    JsonSchemaBuilder.prototype.maximum = function (value) {
        this.schema.maximum = value;
        return this;
    };
    JsonSchemaBuilder.prototype.exclusiveMaximum = function (value) {
        this.schema.exclusiveMaximum = value;
        return this;
    };
    JsonSchemaBuilder.prototype.minimum = function (value) {
        this.schema.minimum = value;
        return this;
    };
    JsonSchemaBuilder.prototype.exclusiveMinimum = function (value) {
        this.schema.exclusiveMinimum = value;
        return this;
    };
    /////////////////////////////////////////////////////////////////////////////
    // String Validation
    /////////////////////////////////////////////////////////////////////////////
    /**
     * Defines the maximum allowable string length.
     *
     * @param value
     */
    JsonSchemaBuilder.prototype.maxLength = function (value) {
        this.schema.maxLength = value;
        return this;
    };
    /**
     * Defines the minimum alloable string length.
     *
     * @param value
     */
    JsonSchemaBuilder.prototype.minLength = function (value) {
        this.schema.minLength = value;
        return this;
    };
    /**
     * String must match the supplied pattern
     *
     * @param regex
     */
    JsonSchemaBuilder.prototype.pattern = function (regex) {
        this.schema.pattern = regex;
        return this;
    };
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
    JsonSchemaBuilder.prototype.additionalItems = function (value) {
        this.schema.additionalItems = value;
        return this;
    };
    /**
     * Items in the array must match the supplied JSON Schema(s)
     *
     * @param value
     * @returns
     */
    JsonSchemaBuilder.prototype.items = function (value) {
        this.schema.items = value;
        return this;
    };
    /**
     * Maximum number of items in Array
     *
     * @param count
     * @returns
     */
    JsonSchemaBuilder.prototype.maxItems = function (count) {
        this.schema.maxItems = count;
        return this;
    };
    /**
     * Minimum number of items in Array
     *
     * @param count
     * @returns
     */
    JsonSchemaBuilder.prototype.minItems = function (count) {
        this.schema.minItems = count;
        return this;
    };
    /**
     * All the items in the array must be unique
     *
     * @param yesOrNo
     * @returns this
     */
    JsonSchemaBuilder.prototype.uniqueItems = function (yesOrNo) {
        this.schema.uniqueItems = yesOrNo;
        return this;
    };
    // Object Validation
    /**
     * Maximum number of properties in object
     *
     * @param count
     * @returns
     */
    JsonSchemaBuilder.prototype.maxProperties = function (count) {
        this.schema.maxProperties = count;
        return this;
    };
    /**
     * Minimum number of properties in object
     *
     * @param count
     * @returns
     */
    JsonSchemaBuilder.prototype.minProperties = function (count) {
        this.schema.minProperties = count;
        return this;
    };
    /**
     * If the object can have additional properties
     *
     * @param value
     * @returns
     */
    JsonSchemaBuilder.prototype.additionalProperties = function (value) {
        this.schema.additionalProperties = value;
        return this;
    };
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
    JsonSchemaBuilder.prototype.definition = function (name, cb) {
        if (!this.schema.definitions) {
            this.schema.definitions = {};
        }
        var definition;
        if (!this.schema.definitions[name]) {
            definition = {};
            this.schema.definitions[name] = definition;
        }
        else {
            definition = this.schema.definitions[name];
        }
        if (cb) {
            cb(new JsonSchemaBuilder(definition));
        }
        return this;
    };
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
    JsonSchemaBuilder.prototype.property = function (name, schema, cb) {
        var propBuilder;
        if (typeof schema === 'function') {
            cb = schema;
        }
        else if (schema) {
            this.schema.properties = this.schema.properties || {};
            this.schema.properties[name] = schema;
        }
        propBuilder = new JsonSchemaPropertyBuilder(name, this.schema);
        if (cb) {
            cb(propBuilder);
        }
        propBuilder.build();
        return this;
    };
    JsonSchemaBuilder.prototype.patternProperty = function (regex, cb) {
        if (!this.schema.patternProperties) {
            this.schema.patternProperties = {};
        }
        var schema;
        if (!this.schema.patternProperties[regex]) {
            schema = {};
            this.schema.patternProperties[regex] = schema;
        }
        else {
            schema = this.schema.patternProperties[regex];
        }
        if (cb) {
            var schemaBuilder = new JsonSchemaBuilder(schema);
            cb(schemaBuilder);
            schemaBuilder.build();
        }
        return this;
    };
    /////////////////////////////////////////////////////////////////////////////
    // Generic
    /////////////////////////////////////////////////////////////////////////////
    /**
     * Enumerate the acceptable values
     *
     * @param values
     * @returns
     */
    JsonSchemaBuilder.prototype['enum'] = function (values) {
        this.schema.enum = values;
        return this;
    };
    /**
     * Sets the type of the schema
     */
    JsonSchemaBuilder.prototype.type = function (type) {
        this.schema.type = type;
        return this;
    };
    /**
     * Adds the specified type to the schema
     *
     * If there is already a type set on the schema then the passed in type
     * is added to the array of types if it is not already present
     *
     * @param type
     */
    JsonSchemaBuilder.prototype.canBeType = function (type) {
        if (!this.schema.type) {
            this.schema.type = type;
        }
        else if (Array.isArray(this.schema.type)) {
            if (this.schema.type.indexOf(type) === -1) {
                this.schema.type.push(type);
            }
        }
        else {
            this.schema.type = [this.schema.type, type];
        }
    };
    /**
     * Adds the "string" type to the schema
     */
    JsonSchemaBuilder.prototype.canBeString = function () {
        this.canBeType(exports.JsonType.string);
        return this;
    };
    /**
     * Adds the "integer" type to the schema
     */
    JsonSchemaBuilder.prototype.canBeInteger = function () {
        this.canBeType(exports.JsonType.integer);
        return this;
    };
    /**
     * Adds the "number" type to the schema
     */
    JsonSchemaBuilder.prototype.canBeNumber = function () {
        this.canBeType(exports.JsonType.number);
        return this;
    };
    /**
     * Adds the "object" type to the schema
     */
    JsonSchemaBuilder.prototype.canBeObject = function () {
        this.canBeType(exports.JsonType.object);
        return this;
    };
    /**
     * Adds the "array" type to the schema
     */
    JsonSchemaBuilder.prototype.canBeArray = function () {
        this.canBeType(exports.JsonType.array);
        return this;
    };
    /**
     * Adds the "boolean" type to the schema
     */
    JsonSchemaBuilder.prototype.canBeBoolean = function () {
        this.canBeType(exports.JsonType.boolean);
        return this;
    };
    /**
     * Adds the "null" type to the schema
     */
    JsonSchemaBuilder.prototype.canBeNull = function () {
        this.canBeType(exports.JsonType.null);
        return this;
    };
    JsonSchemaBuilder.prototype.format = function (format) {
        this.schema.format = format;
        return this;
    };
    /////////////////////////////////////////////////////////////////////////////
    // Schema Composition (Cobining Schemas)
    /////////////////////////////////////////////////////////////////////////////
    JsonSchemaBuilder.prototype.allOf = function (schemas) {
        if (!this.schema.allOf) {
            this.schema.allOf = [];
        }
        this.schema.allOf = this.schema.allOf.concat(schemas);
        return this;
    };
    JsonSchemaBuilder.prototype.anyOf = function (schemas) {
        if (!this.schema.anyOf) {
            this.schema.anyOf = [];
        }
        this.schema.anyOf = this.schema.anyOf.concat(schemas);
        return this;
    };
    JsonSchemaBuilder.prototype.oneOf = function (schemas) {
        if (!this.schema.oneOf) {
            this.schema.oneOf = [];
        }
        this.schema.oneOf = this.schema.oneOf.concat(schemas);
        return this;
    };
    JsonSchemaBuilder.prototype.not = function (schema) {
        this.schema.not = schema;
        return this;
    };
    JsonSchemaBuilder.prototype.build = function () {
        return this.schema;
    };
    return JsonSchemaBuilder;
}());
exports.JsonSchemaBuilder = JsonSchemaBuilder;
var JsonSchemaPropertyBuilder = (function (_super) {
    __extends(JsonSchemaPropertyBuilder, _super);
    function JsonSchemaPropertyBuilder(property, parentSchema) {
        var _this;
        if (!parentSchema.properties) {
            parentSchema.properties = {};
        }
        var thisSchema;
        if (!parentSchema.properties[property]) {
            thisSchema = {};
            parentSchema.properties[property] = thisSchema;
        }
        else {
            thisSchema = parentSchema.properties[property];
        }
        _this = _super.call(this, thisSchema) || this;
        _this.propertyKey = property;
        _this.parentSchema = parentSchema;
        return _this;
    }
    JsonSchemaPropertyBuilder.prototype.required = function () {
        if (!this.parentSchema.required) {
            this.parentSchema.required = [];
        }
        this.parentSchema.required.push(this.propertyKey);
        return this;
    };
    JsonSchemaPropertyBuilder.prototype.dependency = function (dependsOn) {
        var property = this.propertyKey;
        if (!this.parentSchema.dependencies) {
            this.parentSchema.dependencies = {};
        }
        if (dependsOn instanceof Array) {
            if (!this.parentSchema.dependencies[property]) {
                this.parentSchema.dependencies[property] = [];
            }
            this.parentSchema.dependencies[property].concat(dependsOn);
        }
        else {
            this.parentSchema.dependencies[property] = dependsOn;
        }
    };
    return JsonSchemaPropertyBuilder;
}(JsonSchemaBuilder));
exports.JsonSchemaPropertyBuilder = JsonSchemaPropertyBuilder;
