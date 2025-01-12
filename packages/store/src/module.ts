import {
  APP_BOOTSTRAP_LISTENER,
  ModuleWithProviders,
  NgModule,
  Provider
} from '@angular/core';
import {
  ɵNGXS_STATE_FACTORY,
  ɵNGXS_STATE_CONTEXT_FACTORY,
  NgxsBootstrapper,
  StateClass
} from '@ngxs/store/internals';

import {
  FEATURE_STATE_TOKEN,
  NgxsModuleOptions,
  ROOT_OPTIONS,
  ROOT_STATE_TOKEN
} from './symbols';
import { USER_PROVIDED_NGXS_EXECUTION_STRATEGY } from './execution/symbols';
import { StateFactory } from './internal/state-factory';
import { StateContextFactory } from './internal/state-context-factory';
import { PluginManager } from './plugin-manager';
import { NgxsRootModule } from './modules/ngxs-root.module';
import { NgxsFeatureModule } from './modules/ngxs-feature.module';

/**
 * Ngxs Module
 */
@NgModule()
export class NgxsModule {
  /**
   * Root module factory
   */
  static forRoot(
    states: StateClass[] = [],
    options: NgxsModuleOptions = {}
  ): ModuleWithProviders<NgxsRootModule> {
    return {
      ngModule: NgxsRootModule,
      providers: [
        StateFactory,
        PluginManager,
        ...states,
        ...NgxsModule.ngxsTokenProviders(states, options)
      ]
    };
  }

  /**
   * Feature module factory
   */
  static forFeature(states: StateClass[] = []): ModuleWithProviders<NgxsFeatureModule> {
    return {
      ngModule: NgxsFeatureModule,
      providers: [
        // This is required on the feature level, see comments in `state-factory.ts`.
        StateFactory,
        PluginManager,
        ...states,
        {
          provide: FEATURE_STATE_TOKEN,
          multi: true,
          useValue: states
        }
      ]
    };
  }

  private static ngxsTokenProviders(
    states: StateClass[],
    options: NgxsModuleOptions
  ): Provider[] {
    return [
      {
        provide: USER_PROVIDED_NGXS_EXECUTION_STRATEGY,
        useValue: options.executionStrategy
      },
      {
        provide: ROOT_STATE_TOKEN,
        useValue: states
      },
      {
        provide: ROOT_OPTIONS,
        useValue: options
      },
      {
        provide: APP_BOOTSTRAP_LISTENER,
        useFactory: NgxsModule.appBootstrapListenerFactory,
        multi: true,
        deps: [NgxsBootstrapper]
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

  private static appBootstrapListenerFactory(bootstrapper: NgxsBootstrapper): Function {
    return () => bootstrapper.bootstrap();
  }
}
