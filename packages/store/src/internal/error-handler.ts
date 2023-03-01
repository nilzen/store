import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { NgxsConfig } from '../symbols';
import { leaveNgxs } from '../operators/leave-ngxs';
import { NgxsExecutionStrategy } from '../execution/symbols';

/**
 * This operator is used for piping the observable result
 * from the `dispatch()`. It has a "smart" error handling
 * strategy that allows us to decide whether we propagate
 * errors to Angular's `ErrorHandler` or enable users to
 * handle them manually. We consider following cases:
 * 1) `store.dispatch()` (no subscribe) -> call `handleError()`
 * 2) `store.dispatch().subscribe()` (no error callback) -> call `handleError()`
 * 3) `store.dispatch().subscribe({ error: ... })` -> don't call `handleError()`
 * 4) `toPromise()` without `catch` -> do `handleError()`
 * 5) `toPromise()` with `catch` -> don't `handleError()`
 */
export function ngxsErrorHandler<T>(
  config: NgxsConfig,
  internalErrorReporter: InternalErrorReporter,
  ngxsExecutionStrategy: NgxsExecutionStrategy
) {
  return (source: Observable<T>) => {
    let subscribed = false;

    source.subscribe({
      error: error => {
        // When `useNgxsErrorHandlingStrategy` is truthy (by default),
        // we catch errors explicitly and provide them to the Angular error handler.
        // The explicit error handling mechanism is required because of the NGXS
        // action handling strategy. The default action handling process leaves the
        // Angular zone, so NGXS actions are invoked in the <root> zone context.
        // All caught actions must be returned to the Angular error handler.
        if (config.useNgxsErrorHandlingStrategy) {
          ngxsExecutionStrategy.leave(() => internalErrorReporter.reportErrorSafely(error));
        } else {
          // Do not trigger change detection for a microtask. This depends on the execution
          // strategy being used, but the default `DispatchOutsideZoneNgxsExecutionStrategy`
          // leaves the Angular zone.
          scheduleMicrotask(ngxsExecutionStrategy, () => {
            if (!subscribed) {
              ngxsExecutionStrategy.leave(() =>
                internalErrorReporter.reportErrorSafely(error)
              );
            }
          });
        }
      }
    });

    return new Observable(subscriber => {
      subscribed = true;
      return source.pipe(leaveNgxs(ngxsExecutionStrategy)).subscribe(subscriber);
    });
  };
}

@Injectable({ providedIn: 'root' })
export class InternalErrorReporter {
  private _errorHandler: ErrorHandler = null!;

  constructor(private _injector: Injector) {}

  reportErrorSafely(error: any): void {
    // Retrieve lazily to avoid cyclic dependency exception.
    this._errorHandler ||= this._injector.get(ErrorHandler);

    // The `try-catch` is used to avoid handling the error twice. Suppose we call
    // `handleError` which re-throws the error internally. The re-thrown error will
    // be caught by zone.js which will then get to the `zone.onError.emit()` and the
    // `onError` subscriber will call `handleError` again.
    try {
      this._errorHandler.handleError(error);
    } catch {}
  }
}

const promise = Promise.resolve();
function scheduleMicrotask(ngxsExecutionStrategy: NgxsExecutionStrategy, cb: VoidFunction) {
  return ngxsExecutionStrategy.enter(() => promise.then(cb));
}
