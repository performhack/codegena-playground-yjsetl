import * as _ from 'lodash';

import { OperatorFunction } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Partial, AppComponentContext } from './context';

/**
 * RxJS Operator: reduce partial context to common context.
 * Mutates source context without creation of new.
 */
export function reduceContext(defaultState: AppComponentContext): OperatorFunction<
  Partial<AppComponentContext>,
  AppComponentContext
> {
  return scan<
    Partial<AppComponentContext>,
    AppComponentContext
  >(
    (acc, value) => _.assign(acc, value) as AppComponentContext,
    defaultState
  );
}
