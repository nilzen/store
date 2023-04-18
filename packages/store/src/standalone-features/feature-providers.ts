import { Provider } from '@angular/core';
import { StateClass } from '@ngxs/store/internals';

import { FEATURE_STATE_TOKEN } from '../symbols';
import { PluginManager } from '../plugin-manager';
import { StateFactory } from '../internal/state-factory';

/**
 * This function returns providers required when calling `NgxsModule.forFeature`
 * or `provideFeatureStore`. This is shared between NgModule and standalone APIs.
 */
export function getNgxsFeatureProviders(states: StateClass[]): Provider[] {
  return [
    StateFactory,
    PluginManager,
    ...states,
    {
      provide: FEATURE_STATE_TOKEN,
      multi: true,
      useValue: states
    }
  ];
}
