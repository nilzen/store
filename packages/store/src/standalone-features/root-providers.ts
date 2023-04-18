import { APP_BOOTSTRAP_LISTENER, Provider } from '@angular/core';
import {
  INITIAL_STATE_TOKEN,
  InitialState,
  NgxsBootstrapper,
  StateClass,
  ɵNGXS_STATE_CONTEXT_FACTORY,
  ɵNGXS_STATE_FACTORY
} from '@ngxs/store/internals';

import { Store } from '../store';
import { mergeDeep } from '../utils/utils';
import { StateStream } from '../plugin_api';
import { PluginManager } from '../plugin-manager';
import { StateFactory } from '../internal/state-factory';
import { Actions, InternalActions } from '../actions-stream';
import { SelectFactory } from '../decorators/select/select-factory';
import { CUSTOM_NGXS_EXECUTION_STRATEGY } from '../execution/symbols';
import { InternalStateOperations } from '../internal/state-operations';
import { StateContextFactory } from '../internal/state-context-factory';
import { LifecycleStateManager } from '../internal/lifecycle-state-manager';
import { InternalDispatchedActionResults, InternalDispatcher } from '../internal/dispatcher';
import { InternalNgxsExecutionStrategy } from '../execution/internal-ngxs-execution-strategy';
import { NgxsConfig, NgxsModuleOptions, ROOT_STATE_TOKEN, NGXS_OPTIONS } from '../symbols';

/**
 * This function returns providers required when calling `NgxsModule.forRoot`
 * or `provideStore`. This is shared between NgModule and standalone APIs.
 */
export function getNgxsRootProviders(
  states: StateClass[],
  options: NgxsModuleOptions
): Provider[] {
  return [
    StateFactory,
    StateContextFactory,
    Actions,
    InternalActions,
    NgxsBootstrapper,
    LifecycleStateManager,
    InternalDispatcher,
    InternalDispatchedActionResults,
    InternalStateOperations,
    InternalNgxsExecutionStrategy,
    Store,
    StateStream,
    SelectFactory,
    PluginManager,
    ...states,
    {
      provide: ROOT_STATE_TOKEN,
      useValue: states
    },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: (bootstrapper: NgxsBootstrapper) => () => bootstrapper.bootstrap(),
      multi: true,
      deps: [NgxsBootstrapper]
    },
    {
      provide: INITIAL_STATE_TOKEN,
      useFactory: () => InitialState.pop()
    },
    {
      provide: NGXS_OPTIONS,
      useValue: options
    },
    {
      provide: CUSTOM_NGXS_EXECUTION_STRATEGY,
      useValue: options.executionStrategy
    },
    {
      provide: NgxsConfig,
      useFactory: (options: NgxsModuleOptions) => mergeDeep(new NgxsConfig(), options),
      deps: [NGXS_OPTIONS]
    },
    {
      provide: ɵNGXS_STATE_CONTEXT_FACTORY,
      useExisting: StateContextFactory
    },
    {
      provide: ɵNGXS_STATE_FACTORY,
      useExisting: StateFactory
    }
  ];
}
