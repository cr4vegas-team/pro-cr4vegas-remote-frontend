import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { LoginComponent } from './components/pages/login/login.component';

// Angular Materials
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { JwtModule } from '@auth0/angular-jwt';
import { GLOBAL } from './services/global';
import { DialogHydrantComponent } from './components/shared/dialog-hydrant/dialog-hydrant.component';
import { DialogInfoComponent } from './components/shared/dialog-info/dialog-info.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DialogHydrantComponent,
    DialogInfoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => { return localStorage.getItem('access_token')},
        allowedDomains: [GLOBAL.API + 'login'],
        disallowedRoutes: [GLOBAL.API + 'map']
      }
    }),
    AppRoutingModule,
  ],
  providers: [
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
