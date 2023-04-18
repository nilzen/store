import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { StateClass } from '@ngxs/store/internals';

import { getNgxsRootProviders } from './root-providers';
import { NgxsStoreFeature } from './providers-features';
import { NGXS_ROOT_ENVIRONMENT_INITIALIZER } from './initializers';

/**
 * Provides the global Store providers and initializes the Store.
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideStore([CountriesState])]
 * });
 * ```
 */
export function provideStore(
  states: StateClass[] = [],
  ...features: NgxsStoreFeature[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    ...getNgxsRootProviders(states, /* options */ {}),
    features,
    NGXS_ROOT_ENVIRONMENT_INITIALIZER
  ]);
}
