import { init as initApm } from '@elastic/apm-rum';
const apm = initApm({

  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: 'web-ui',

  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: '',

  // Set service version (required for sourcemap feature)
  serviceVersion: '0.1',
  agentVersion: '4.0.1',
  distributedTracingOrigins: ["http://localhost:8080"],
  environment: 'development'
});
apm.setInitialPageLoadName('index');
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
