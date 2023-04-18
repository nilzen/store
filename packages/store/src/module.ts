import { ModuleWithProviders, NgModule } from '@angular/core';
import { StateClass } from '@ngxs/store/internals';

import { NgxsModuleOptions } from './symbols';
import { NgxsRootModule } from './modules/ngxs-root.module';
import { NgxsFeatureModule } from './modules/ngxs-feature.module';
import { getNgxsRootProviders } from './standalone-features/root-providers';
import { getNgxsFeatureProviders } from './standalone-features/feature-providers';

@NgModule()
export class NgxsModule {
  static forRoot(
    states: StateClass[] = [],
    options: NgxsModuleOptions = {}
  ): ModuleWithProviders<NgxsRootModule> {
    return {
      ngModule: NgxsRootModule,
      providers: getNgxsRootProviders(states, options)
    };
  }

  static forFeature(states: StateClass[] = []): ModuleWithProviders<NgxsFeatureModule> {
    return {
      ngModule: NgxsFeatureModule,
      providers: getNgxsFeatureProviders(states)
    };
  }
}
