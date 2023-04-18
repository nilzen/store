import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { SHARED_PLATFORM_PROVIDERS } from './shared-platform-providers';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideAnimations(), ...SHARED_PLATFORM_PROVIDERS]
});
