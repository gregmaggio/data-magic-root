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
import { CacheInterceptor } from './cacheinterceptor.component';
import { ConfigService } from './service/config.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AndroidPrivacyPolicyComponent } from './androidprivacypolicy/androidprivacypolicy.component';

export function initApp(http: HttpClient) {
  return async () => {
    var configService: ConfigService = new ConfigService(http);
    var appConfigLoaded:boolean = await configService.loadAppConfig();
    var secureService: SecureService = new SecureService(http);
    var secureConfigLoaded:boolean = await secureService.loadSecureConfig();
    return appConfigLoaded && secureConfigLoaded;
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    HurricaneTracksComponent,
    AndroidPrivacyPolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    GoogleMapsModule,
    RecaptchaModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [
    HttpClient,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
      deps: [HttpClient, SecureService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
