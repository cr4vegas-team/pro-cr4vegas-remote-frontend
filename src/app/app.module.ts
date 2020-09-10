import { HttpClientModule } from '@angular/common/http';
// ==================================================
// MODULES
// ==================================================
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { MqttModule } from 'ngx-mqtt';
import { environment as env } from '../environments/environment';
// ==================================================
// COMPONENTS
// ==================================================
import { AppComponent } from './app.component';
import { UnitModule } from './modules/unit/unit.module';
import { WrapModule } from './modules/wrap/wrap.module';
import { SharedModule } from './shared/shared.module';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

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
    
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['http://localhost:8881'],
      }
    }),


    SharedModule,
    UnitModule,
    WrapModule,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
