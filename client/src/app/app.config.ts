import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes,
      withComponentInputBinding(),
      withRouterConfig({paramsInheritanceStrategy: 'always'})
     ),
importProvidersFrom(
  SocketIoModule.forRoot(config)

), provideAnimationsAsync()
  ]
};
