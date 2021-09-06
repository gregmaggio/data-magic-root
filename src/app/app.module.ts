import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HurricaneTracksComponent } from './hurricanetracks/hurricanetracks.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ContactComponent } from './contact/contact.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { AboutComponent } from './about/about.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeComponent } from './home/home.component';
import { SecureService } from './service/secure.service';

export function initApp(http: HttpClient) {
  return () => {
    var service: SecureService = new SecureService(http);
    return service.loadSecureConfig();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    HurricaneTracksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    GoogleMapsModule,
    RecaptchaModule,
    MatProgressSpinnerModule
  ],
  providers: [
    HttpClient,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
      deps: [HttpClient, SecureService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
