import * as _ from 'lodash';

import { Observable, Subscriber } from 'rxjs';
import {
  AppComponentContext,
  ConvertedFileInfo,
  Partial
} from './context'

import {
  AbstractApplication as AbstractCliApplication,
  CliConfig,
  defaultCliConfig
} from '@codegena/oapi3ts-cli';

type SubContext = Partial<AppComponentContext>;

// todo move to standalone class file
export class BrowserCliApplication extends AbstractCliApplication {

  constructor(protected structure) {
    super();
  }

  public files: {
    [group: string]: ConvertedFileInfo[]
  } = {}; 

  protected get destPathAbs(): string {
      return this.cliConfig.destPath;
  }

  protected getCliConfig(): CliConfig {
    return {
      ...defaultCliConfig,
      destPath: null,
      separatedFiles: true,
      servicesDirectory: 'services',
      typingsDirectory: 'types',
      srcPath: 'browser',
      typingsFromServices: 'typings'
    }
  }

  protected getOApiStructure() {
    return this.structure;
  }

  protected saveFile(
    filename: string,
    subdir: string,
    content: string
  ): void {
    if (!this.files[subdir]) {
      this.files[subdir] = [];
    }

    this.files[subdir].push({
      filename,
      content
    });
  }
}

export function actionConvert(subContext: SubContext) {
  return Observable.create((subscriber: Subscriber<SubContext>) => {
    setTimeout(() => {
      const convertor = new BrowserCliApplication(subContext.schema);
      convertor.createTypings();
      convertor.createServices('angular');
      subContext.convertedFiles = _.mapValues(
        convertor.files,
        fileGroup => _.sortBy(fileGroup, ['filename'])
      );

      subscriber.next(subContext);
      subscriber.complete();
    });
  }, 100)
}
