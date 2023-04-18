import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { AppComponent } from './app/app.component';
export { APP_ID_VALUE, SHARED_PLATFORM_PROVIDERS } from './shared-platform-providers';
