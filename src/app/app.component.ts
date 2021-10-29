import * as _ from 'lodash';

import {
  animationFrameScheduler,
  asapScheduler,
  BehaviorSubject,
  ConnectableObservable,
  Observable,
  ReplaySubject,
  Subject,
  merge,
  of,
  throwError
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  observeOn,
  publishReplay,
  scan,
  share,
  startWith,
  tap
} from 'rxjs/operators';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  examples,
  ExampleMetaInfo
} from './examples';

import {
  ActionType,
  AppComponentContext,
  ComponentStatus,
  Partial,
  // Actions
  actionConvert,
  // Context reducers
  reduceContext,
  // Context mappers
  mapIdToContext,
  mapOAS3CodeToContext
} from './lib';

const TYPING_DEBOUNCE_TIME = 800;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent  {

  /**
   * Template value accesson for `ComponentStatus`.
   */
  public Status = ComponentStatus;

  public status$: BehaviorSubject<ComponentStatus> = new BehaviorSubject(ComponentStatus.New);
  public currentExampleId = new FormControl();
  public oasCode = new FormControl();
  public manualActions: Subject<Partial<AppComponentContext>> = new Subject();

  /**
   * List of available examples
   */
  public examples: ExampleMetaInfo[] = examples;

  /**
   * Context flow of component
   */
  public context$ = merge(
      // Manual actions
      this.manualActions,
      // Value changes of ID
      this.currentExampleId.valueChanges.pipe(
        mapIdToContext(this.examples)
      ),
      // Value changes of oasCode
      this.oasCode.valueChanges.pipe(
        debounceTime(TYPING_DEBOUNCE_TIME),
        mapOAS3CodeToContext()
      )
    ).pipe(
      observeOn(animationFrameScheduler),
      tap(() => this.status$.next(ComponentStatus.Pending)),
      // Applying result to context
      reduceContext(this.defaultState),
      // Triggering async actions
      mergeMap(result => this.triggerActions(result)),
      // Reset on errors
      catchError(err => {
        console.error(err);
        return of(this.defaultState);
      }),
      tap(() => this.status$.next(ComponentStatus.Ready)),
      share(),
      publishReplay()
    ) as ConnectableObservable<AppComponentContext>;

  /**
   * Default state of component.
   * Component gets initialized and get reseted with this state.
   */
  public get defaultState() {
    return {
      ..._.first(examples),
      lastAction: ActionType.Initialize
    };
  }

  // *** Methods

  ngOnInit() {
    this.handleActions();
    this.context$.connect();

    // do initialization
    this.initState();
  }

  triggerActions(
    result: Partial<AppComponentContext>
  ): Observable<Partial<AppComponentContext>> {

    switch(result.lastAction) {
      case ActionType.Convert:
        return actionConvert(result);
      default:
        return of(result);
    }

    return throwError('Not handled case');
  }

  handleActions() {
    this.context$.subscribe(
      (context: AppComponentContext) => {
        /**
         * Helper for changing code in editor
         */
        const updateOasCode = () => {
          this.oasCode.setValue(JSON.stringify(
            context.schema,
            null,
            '  '
          ));
        }

        // Decide how to react to changes
        switch(context.lastAction) {
          case ActionType.CodeType:
            this.currentExampleId.setValue(context.id);
            break;
          case ActionType.ExampleIdChange:
            if (context.schema) {
              updateOasCode();
            }
            break;
          case ActionType.BackToHome:
            // ... no changes
            break;
          default:
            this.currentExampleId.setValue(context.id);
            updateOasCode();
        }
      }
    );
  }

  // Triggers

  initState() {
    this.manualActions.next(this.defaultState);
  }

  resetCurrentExample() {
    this.currentExampleId.setValue(
      this.currentExampleId.value
    );
  }

  doConvert() {
    this.manualActions.next({
      lastAction: ActionType.Convert
    });
  }

  returnFromResults() {
    this.manualActions.next({
      lastAction: ActionType.BackToHome,
      convertedFiles: null
    });
  }
}