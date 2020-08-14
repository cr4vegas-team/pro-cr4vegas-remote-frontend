
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import { environment as env } from '../environments/environment';
import { GLOBAL } from './constants/global.constant';

// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/pages/login/login.component';
import { MapComponent } from './components/pages/map/map.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HydrantComponent } from './components/pages/hydrant/hydrant.component';
import { DialogInfoComponent } from './components/shared/dialog-info/dialog-info.component';
import { DialogUnitHydrantComponent } from './components/shared/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { DialogUnitHydrantCreateComponent } from './components/shared/dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';
import { DialogStationComponent } from './components/shared/dialog-station/dialog-station.component';
import { DialogStationCreateComponent } from './components/shared/dialog-station-create/dialog-station-create.component';
import { DialogSectorComponent } from './components/shared/dialog-sector/dialog-sector.component';
import { DialogSectorCreateComponent } from './components/shared/dialog-sector-create/dialog-sector-create.component';
import { DialogSetComponent } from './components/shared/dialog-set/dialog-set.component';
import { DialogSetCreateComponent } from './components/shared/dialog-set-create/dialog-set-create.component';
import { DialogUnitGenericComponent } from './components/shared/dialog-unit-generic/dialog-unit-generic.component';
import { DialogUnitGenericCreateComponent } from './components/shared/dialog-unit-generic-create/dialog-unit-generic-create.component';

// Services
import { AuthService } from './services/api/auth.service';
import { MapService } from './services/map.service';
import { UnitHydrantService } from './services/api/unit-hydrant.service';
import { SectorService } from './services/api/sector.service';
import { SetService } from './services/api/set.service';
import { StationService } from './services/api/station.service';


// Angular Materials
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';


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
    DialogUnitHydrantComponent,
    DialogInfoComponent,
    NavbarComponent,
    HydrantComponent,
    DialogUnitHydrantCreateComponent,
    DialogStationComponent,
    DialogStationCreateComponent,
    DialogSectorComponent,
    DialogSectorCreateComponent,
    DialogSetComponent,
    DialogSetCreateComponent,
    DialogUnitGenericComponent,
    DialogUnitGenericCreateComponent,
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
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
    MatMenuModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatRadioModule,
    LayoutModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
  ],
  providers: [
    AuthService,
    MapService,
    UnitHydrantService,
    SectorService,
    StationService,
    SetService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
