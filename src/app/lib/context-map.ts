import * as _ from 'lodash';

import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActionType, AppComponentContext } from './context'
import { ExampleMetaInfo } from '../examples'

/**
 * Map context part by `AppComponentContext.id`.
 * Gets actual example data by id.
 */
export function mapIdToContext (examples: ExampleMetaInfo[]) {
  return map<string, Partial<AppComponentContext>>(id => {
    const foundExample = _.find<ExampleMetaInfo>(
      examples,
      (example: ExampleMetaInfo) => example.id === id
    );

    if (!foundExample) {
      throw new Error('Can\'t find example with specified id!');
    }

    return {
      ...foundExample,
      lastAction: ActionType.ExampleIdChange
    };
  });
}

/**
 * Map source code to `shema` in `AppComponentContext`.
 */
export function mapOAS3CodeToContext() {
  return map<string, Partial<AppComponentContext>>(schemaCode => {
    let schema;

    try {
      const objValue = JSON.parse(schemaCode) || null;
      schema = objValue;
    } catch(err) {
      schema = null;
    }

    return {
      schema,
      lastAction: ActionType.ExampleIdChange
    };
  });
}
