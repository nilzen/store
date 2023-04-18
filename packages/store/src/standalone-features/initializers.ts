import { ENVIRONMENT_INITIALIZER, InjectionToken, Provider, inject } from '@angular/core';

import { Store } from '../store';
import { InitState, UpdateState } from '../plugin_api';
import { FEATURE_STATE_TOKEN, ROOT_STATE_TOKEN } from '../symbols';
import { StateFactory } from '../internal/state-factory';
import { StateClassInternal, StatesAndDefaults } from '../internal/internals';
import { SelectFactory } from '../decorators/select/select-factory';
import { InternalStateOperations } from '../internal/state-operations';
import { LifecycleStateManager } from '../internal/lifecycle-state-manager';

/**
 * This function is shared between NgModule and standalone features.
 * We can rely on the same initialization functionality when using
 * `NgxsModule.forRoot` and `provideStore`.
 */
export function rootStoreInitializer() {
  const factory = inject(StateFactory);
  const internalStateOperations = inject(InternalStateOperations);

  inject(Store);
  inject(SelectFactory);

  const states = inject(ROOT_STATE_TOKEN, { optional: true }) || [];
  const lifecycleStateManager = inject(LifecycleStateManager);

  // Add stores to the state graph and return their defaults
  const results: StatesAndDefaults = factory.addAndReturnDefaults(states);

  internalStateOperations.setStateToTheCurrentWithNew(results);

  // Connect our actions stream
  factory.connectActionHandlers();

  // Dispatch the init action and invoke init and bootstrap functions after
  lifecycleStateManager.ngxsBootstrap(new InitState(), results);
}

/**
 * This function is shared between NgModule and standalone features.
 * We can rely on the same initialization functionality when using
 * `NgxsModule.forFeature` and `provideFeatureStore`.
 */
export function featureStoreInitializer() {
  inject(Store);

  const internalStateOperations = inject(InternalStateOperations);
  const factory = inject(StateFactory);
  const states: StateClassInternal[][] = inject(FEATURE_STATE_TOKEN, { optional: true }) || [];
  const lifecycleStateManager = inject(LifecycleStateManager);

  // Since FEATURE_STATE_TOKEN is a multi token, we need to
  // flatten it [[Feature1State, Feature2State], [Feature3State]]
  const flattenedStates: StateClassInternal[] = states.reduce(
    (total: StateClassInternal[], values: StateClassInternal[]) => total.concat(values),
    []
  );

  // add stores to the state graph and return their defaults
  const results: StatesAndDefaults = factory.addAndReturnDefaults(flattenedStates);

  if (results.states.length) {
    internalStateOperations.setStateToTheCurrentWithNew(results);

    // dispatch the update action and invoke init and bootstrap functions after
    lifecycleStateManager.ngxsBootstrap(new UpdateState(results.defaults), results);
  }
}

/**
 * InjectionToken that registers the global Store.
 */
export const NGXS_ROOT_STORE_INITIALIZER = new InjectionToken<void>(
  'NGXS_ROOT_STORE_INITIALIZER'
);

/**
 * InjectionToken that registers feature states.
 */
export const NGXS_FEATURE_STORE_INITIALIZER = new InjectionToken<void>(
  'NGXS_FEATURE_STORE_INITIALIZER'
);

export const NGXS_ROOT_ENVIRONMENT_INITIALIZER: Provider[] = [
  { provide: NGXS_ROOT_STORE_INITIALIZER, useFactory: rootStoreInitializer },
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory() {
      return () => inject(NGXS_ROOT_STORE_INITIALIZER);
    }
  }
];

export const NGXS_FEATURE_ENVIRONMENT_INITIALIZER: Provider[] = [
  { provide: NGXS_FEATURE_STORE_INITIALIZER, useFactory: featureStoreInitializer },
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory() {
      return () => inject(NGXS_FEATURE_STORE_INITIALIZER);
    }
  }
];
