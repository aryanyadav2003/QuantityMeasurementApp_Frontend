import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { tokenInterceptor } from './shared/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Set up routing using our routes file
    provideRouter(routes),

    // Set up HttpClient with the token interceptor
    // The interceptor will automatically attach the JWT to all HttpClient requests
    provideHttpClient(withInterceptors([tokenInterceptor]))
  ]
};