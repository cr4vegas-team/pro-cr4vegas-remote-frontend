
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import { environment as env } from '../environments/environment';
import { GLOBAL } from './services/global';

// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/pages/login/login.component';
import { DialogHydrantComponent } from './components/shared/dialog-hydrant/dialog-hydrant.component';
import { DialogInfoComponent } from './components/shared/dialog-info/dialog-info.component';
import { MapComponent } from './components/pages/map/map.component';

// Services
import { AuthService } from './services/auth.service';
import { MapService } from './services/map.service';
import { HydrantService } from './services/hydrant.service';

// Angular Materials
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';


const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: env.mqtt.server,
  port: env.mqtt.port,
  protocol: (env.mqtt.protocol === "wss") ? "wss" : "ws",
  path: env.mqtt.path,
};

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LoginComponent,
    DialogHydrantComponent,
    DialogInfoComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => { return localStorage.getItem('access_token') },
        allowedDomains: [GLOBAL.API + 'login'],
        disallowedRoutes: [GLOBAL.API + 'map']
      }
    }),
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatGridListModule,
    MatCardModule,
  ],
  providers: [
    AuthService,
    MapService,
    HydrantService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
