import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import {MyPreset} from './preset';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset
      }
    }),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())
  ]
};
