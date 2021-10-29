import * as todoAppSchema from './todo-app.json';
import * as swaggerPetstoreSchema from './swagger-petstore.json';

export interface ExampleMetaInfo {
  description: string,
  id: string;
  isReadonly?: boolean,
  schema: any | null;
  title: string;
};

export const examples: ExampleMetaInfo[] = [
  {
    description: 'A sample API that uses a petstore as an example to demonstrate features in the OpenAPI 3.0',
    id: 'swaggerPetstore',
    isReadonly: true,
    schema: swaggerPetstoreSchema,
    title: 'Swagger Petstore'
  },
  {
    description: 'Complete application schema with CRUD, file uploading and schema\'s storage',
    id: 'todoApp',
    isReadonly: true,
    schema: todoAppSchema,
    title: 'TODO Application'
  },
  {
    description: 'You paste or type your own example and get result',
    id: 'custom',
    isReadonly: false,
    schema: {},
    title: 'Custom schema'
  }
];
