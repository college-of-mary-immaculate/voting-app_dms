import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app/app-routing.module';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(appRoutes)) 
  ]
}).catch(err => console.error(err));