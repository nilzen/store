import { NgModule } from '@angular/core';

import { featureStoreInitializer } from '../standalone-features/initializers';

/**
 * @ignore
 */
@NgModule()
export class NgxsFeatureModule {
  constructor() {
    featureStoreInitializer();
  }
}
