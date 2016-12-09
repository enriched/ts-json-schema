import { assert, expect, should } from 'chai';

import { JsonSchemaBuilder, JsonSchema, JsonType } from '../';

const SimpleSchema: JsonSchema = {
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

describe('JsonSchemaBuidler', () => {

  // Create and test the simple schema example
  describe('Simple Schema', () => {

    let schema = new JsonSchemaBuilder()
      .title("Example Schema")
      .canBeObject()
      .property('firstName', p => p
        .canBeString()
        .required()
      )
      .property('lastName', p => p
        .canBeString()
        .required()
      )
      .property('age', p => p
        .description('Age in years')
        .canBeInteger()
        .minimum(0)
      )
      .build();

    it('should have title: "Example Schema"', () => {
      expect(schema.title).equals(SimpleSchema.title);
    });

    it('should have root type "object"', () => {
      expect(schema.type).equals(SimpleSchema.type);
    });

    it('should have firstName property', () => {
      expect(schema.properties).to.have.property('firstName')
        .that.has.property('type', JsonType.string);
    });

    it('should have lastName property', () => {
      expect(schema.properties).to.have.property('lastName')
        .that.has.property('type', JsonType.string);
    });

    it('should have age property', () => {
      expect(schema.properties).to.have.property('age')
        .that.deep.equals(SimpleSchema.properties['age']);
    });

    it('should have first and last name in the required array', () => {
      expect(schema.required).to.include('firstName');
      expect(schema.required).to.include('lastName');
    });
  })
})