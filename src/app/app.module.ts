
import { HttpClientModule } from '@angular/common/http';
// ==================================================
// MODULES
// ==================================================
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { MqttModule } from 'ngx-mqtt';
import { environment as env } from '../environments/environment';
import { AppRoutingModule } from './shared/app-routing.module';
// ==================================================
// COMPONENTS
// ==================================================
import { AppComponent } from './app.component';
import { DialogInfoComponent } from './shared/components/dialog-info/dialog-info.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { LoginComponent } from './shared/components/page-login/page-login.component';
import { MapComponent } from './shared/components/page-map/page-map.component';
import { MaterialModule } from './shared/material.module';
import { UnitModule } from './modules/unit/unit.module';
import { WrapModule } from './modules/wrap/wrap.module';
import { GLOBAL } from './shared/constants/global.constant';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LoginComponent,
    NavbarComponent,
    DialogInfoComponent,
  ],
  imports: [
    MqttModule.forRoot({
      hostname: env.mqtt.hostname,
      protocol: (env.mqtt.protocol === "wss") ? "wss" : "ws",
      path: env.mqtt.path,
      rejectUnauthorized: false,
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => { return localStorage.getItem('access_token') },
        allowedDomains: [GLOBAL.API + 'login'],
        disallowedRoutes: [GLOBAL.API + 'map']
      }
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,

    MaterialModule,
    UnitModule,
    WrapModule,
    SharedModule,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
