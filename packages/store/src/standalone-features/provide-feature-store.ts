import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { StateClass } from '@ngxs/store/internals';

import { NgxsStoreFeature } from './providers-features';
import { getNgxsFeatureProviders } from './feature-providers';
import { NGXS_FEATURE_ENVIRONMENT_INITIALIZER } from './initializers';

/**
 * This is a standalone version of `NgxsModule.forFeature`. This might be used in the
 * same way to register feature states, but on the `Route` providers level:
 *
 * ```ts
 * const routes: Routes = [
 *   {
 *     path: 'products',
 *     loadComponent: async () => {...},
 *     providers: [provideFeatureStore([ProductsState])]
 *   }
 * ];
 * ```
 */
export function provideFeatureStore(
  states: StateClass[],
  ...features: NgxsStoreFeature[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    ...getNgxsFeatureProviders(states),
    features,
    NGXS_FEATURE_ENVIRONMENT_INITIALIZER
  ]);
}
