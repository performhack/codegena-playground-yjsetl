import { GlobalPartial } from 'lodash';

import {
  examples,
  ExampleMetaInfo
} from '../examples';

export enum ComponentStatus {
  New = 'new',
  Loading = 'loading',
  Ready = 'ready',
  Pending = 'pending'
}

/**
 * Supported types of action
 */
export enum ActionType {
  BackToHome,
  CodeType,
  Convert,
  ExampleIdChange,
  Initialize
}

export interface ConvertedFileInfo {
  filename: string;
  content: string;
}

/**
 * Context of {@link AppComponent}
 */
export type AppComponentContext = ExampleMetaInfo & {
  /**
   * Type of action
   */
  lastAction: ActionType,

  convertedFiles?: {
    services?: ConvertedFileInfo[],
    types?: ConvertedFileInfo[]
  }
};

export type Partial<T> = GlobalPartial<T>;
