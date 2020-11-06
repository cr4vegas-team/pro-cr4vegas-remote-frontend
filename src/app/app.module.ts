import { MaterialModule } from './shared/material.module';
import { GeneralModule } from './modules/general/general.module';
import { SessionModule } from './modules/session/session.module';
import { environment as env } from '../environments/environment';
// ==================================================
// MODULES
// ==================================================
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { MqttModule } from 'ngx-mqtt';
import { UnitModule } from './modules/unit/unit.module';
import { WrapModule } from './modules/wrap/wrap.module';
import { SharedModule } from './shared/shared.module';
// ==================================================
// COMPONENTS
// ==================================================
import { AppComponent } from './app.component';

export function tokenGetter(): string {
  return localStorage.getItem('access_token');
}

@NgModule({
  // ===========================================================
  //  DECLARATIONS
  // ===========================================================
  declarations: [AppComponent],
  // ===========================================================
  //  IMPORTS
  // ===========================================================
  imports: [
    MqttModule.forRoot({
      hostname: env.mqtt.hostname,
      protocol: env.mqtt.protocol === 'wss' ? 'wss' : 'ws',
      path: env.mqtt.path,
      port: 8084,
    }),

    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['http://localhost:8881'],
      },
    }),

    SharedModule,
    UnitModule,
    WrapModule,
    SessionModule,
    GeneralModule,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
