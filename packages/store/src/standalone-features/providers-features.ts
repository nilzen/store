import { EnvironmentProviders, Provider, Type } from '@angular/core';

import { CUSTOM_NGXS_EXECUTION_STRATEGY } from '../execution/symbols';
import { NGXS_OPTIONS, NGXS_PLUGINS, NgxsModuleOptions, NgxsPlugin } from '../symbols';

/**
 * Registers NGXS options when calling `provideStore`.
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideStore(
 *       [CountriesState],
 *       withNgxsOptions({ developmentMode: !environment.production })
 *     )
 *   ]
 * });
 * ```
 */
export function withNgxsOptions(options: NgxsModuleOptions = {}): NgxsStoreFeature {
  return [
    { provide: NGXS_OPTIONS, useValue: options },
    { provide: CUSTOM_NGXS_EXECUTION_STRATEGY, useValue: options.executionStrategy }
  ];
}

/**
 * Registers custom global plugin for the state.
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideStore(
 *       [CountriesState],
 *       withNgxsOptions({ developmentMode: !environment.production }),
 *       withNgxsPlugin(logoutPlugin)
 *     )
 *   ]
 * });
 * ```
 */
export function withNgxsPlugin(plugin: Type<NgxsPlugin>): NgxsStoreFeature {
  return [{ provide: NGXS_PLUGINS, useClass: plugin, multi: true }];
}

/**
 * A type alias that represents providers that act as NGXS Store features
 * available for use with `provideStore`.
 */
export type NgxsStoreFeature = EnvironmentProviders | Provider;
