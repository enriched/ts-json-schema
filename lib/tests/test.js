"use strict";
var chai_1 = require("chai");
var _1 = require("../");
var SimpleSchema = {
    title: "Example Schema",
    type: "object",
    properties: {
        firstName: {
            type: "string"
        },
        lastName: {
            type: "string"
        },
        age: {
            description: "Age in years",
            type: "integer",
            minimum: 0
        }
    },
    required: ["firstName", "lastName"]
};
describe('JsonSchemaBuidler', function () {
    // Create and test the simple schema example
    describe('Simple Schema', function () {
        var schema = new _1.JsonSchemaBuilder()
            .title("Example Schema")
            .canBeObject()
            .property('firstName', function (p) { return p
            .canBeString()
            .required(); })
            .property('lastName', function (p) { return p
            .canBeString()
            .required(); })
            .property('age', function (p) { return p
            .description('Age in years')
            .canBeInteger()
            .minimum(0); })
            .build();
        it('should have title: "Example Schema"', function () {
            chai_1.expect(schema.title).equals(SimpleSchema.title);
        });
        it('should have root type "object"', function () {
            chai_1.expect(schema.type).equals(SimpleSchema.type);
        });
        it('should have firstName property', function () {
            chai_1.expect(schema.properties).to.have.property('firstName')
                .that.has.property('type', _1.JsonType.string);
        });
        it('should have lastName property', function () {
            chai_1.expect(schema.properties).to.have.property('lastName')
                .that.has.property('type', _1.JsonType.string);
        });
        it('should have age property', function () {
            chai_1.expect(schema.properties).to.have.property('age')
                .that.deep.equals(SimpleSchema.properties['age']);
        });
        it('should have first and last name in the required array', function () {
            chai_1.expect(schema.required).to.include('firstName');
            chai_1.expect(schema.required).to.include('lastName');
        });
    });
});
