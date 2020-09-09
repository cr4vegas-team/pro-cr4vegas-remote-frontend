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
// ==================================================
// COMPONENTS
// ==================================================
import { AppComponent } from './app.component';
import { GLOBAL } from './shared/constants/global.constant';
// ==================================================
// SERVICES
// ==================================================
import { AuthService } from './shared/services/auth.service';
import { MapService } from './shared/services/map.service';
import { MqttEventsService } from './shared/services/mqtt-events.service';
import { SharedModule } from './shared/shared.module';


@NgModule({

  //===========================================================
  // DECLARATIONS
  //===========================================================
  declarations: [
    AppComponent,
  ],
  //===========================================================
  // IMPORTS
  //===========================================================
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

    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,

    SharedModule,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }