import { NgModule, ModuleWithProviders } from '@angular/core';
import { NGXS_PLUGINS, NgxsStoreFeature, withNgxsPlugin } from '@ngxs/store';

import { NgxsFormPlugin } from './form.plugin';
import { NgxsFormDirective } from './directive';

@NgModule({
  imports: [NgxsFormDirective],
  exports: [NgxsFormDirective]
})
export class NgxsFormPluginModule {
  static forRoot(): ModuleWithProviders<NgxsFormPluginModule> {
    return {
      ngModule: NgxsFormPluginModule,
      providers: [
        {
          provide: NGXS_PLUGINS,
          useClass: NgxsFormPlugin,
          multi: true
        }
      ]
    };
  }
}

export function withNgxsFormPlugin(): NgxsStoreFeature {
  return [withNgxsPlugin(NgxsFormPlugin)];
}
