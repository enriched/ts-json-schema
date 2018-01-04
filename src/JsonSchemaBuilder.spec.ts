import 'jest';

import {
  JsonSchema,
  JsonSchemaBuilder,
  JsonType,
  Format,
  PropSchemaCB,
} from './';

const SimpleSchema: JsonSchema = {
  title: 'Example Schema',
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    age: {
      description: 'Age in years',
      type: 'integer',
      minimum: 0,
    },
  },
  required: ['firstName', 'lastName'],
};

describe('JsonSchemaBuidler', () => {
  let builtSchema: JsonSchema;
  // Create and test the simple schema example
  beforeAll(() => {
    const requiredCb: PropSchemaCB = p => {
      console.log(`called the cb`);
      p.required();
    };
    builtSchema = new JsonSchemaBuilder()
      .property('id', { type: JsonType.string })
      .title('Example Schema')
      .property([], p => p.canBeObject())
      .property(['firstName'], p => p.canBeString().required())
      .property('lastName', { type: JsonType.string }, requiredCb)
      .property('city')
      .property('city', p => p.canBeNumber())
      .property('city', {
        type: JsonType.string,
      })
      .property('age', p =>
        p
          .description('Age in years')
          .canBeInteger()
          .minimum(0),
      )
      .property(['manager', 'id'], { format: Format.uuid }, p =>
        p.canBeString().required(),
      )
      .build();
    console.log(JSON.stringify(builtSchema, null, 2));
  });

  it('should have title: "Example Schema"', () => {
    expect(builtSchema.title).toEqual(SimpleSchema.title);
  });

  it('should have root type "object"', () => {
    expect(builtSchema.type).toEqual(SimpleSchema.type);
  });

  it('should have firstName property', () => {
    expect(builtSchema.properties.firstName).toBeTruthy();
    expect(builtSchema.properties.firstName.type).toEqual(JsonType.string);
  });

  it('should have lastName property', () => {
    expect(builtSchema.properties.lastName).toBeTruthy();
    expect(builtSchema.properties.lastName.type).toEqual(JsonType.string);
  });

  it('should have city property type as string', () => {
    expect(builtSchema.properties.city.type).toEqual(JsonType.string);
  });

  it('should have age property', () => {
    expect(builtSchema.properties.age).toBeTruthy();
    expect(builtSchema.properties.age).toMatchObject(
      SimpleSchema.properties.age,
    );
  });

  it('should have manager with id property', () => {
    expect(builtSchema.properties.manager.properties.id.type).toEqual(
      JsonType.string,
    );
  });

  it('should have first and last name in the required array', () => {
    expect(builtSchema.required).toContain('firstName');
    expect(builtSchema.required).toContain('lastName');
  });
});
