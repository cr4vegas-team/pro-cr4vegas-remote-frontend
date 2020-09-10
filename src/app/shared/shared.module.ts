import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { DialogInfoComponent } from './components/dialog-info/dialog-info.component';
import { DialogResultComponent } from './components/dialog-result/dialog-result.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/page-login/page-login.component';
import { MapComponent } from './components/page-map/page-map.component';
import { MaterialModule } from './material.module';
import { AuthService } from './services/auth.service';
import { MapService } from './services/map.service';
import { MqttEventsService } from './services/mqtt-events.service';

const modules = [
  MaterialModule,
  ChartsModule,
  AppRoutingModule
];

@NgModule({

  declarations: [
    MapComponent,
    LoginComponent,
    NavbarComponent,
    DialogInfoComponent,
    DialogResultComponent,
  ],
  //===========================================================
  // IMPORTS
  //===========================================================
  imports: [
    ...modules
  ],
  //===========================================================
  // EXPORTS
  //===========================================================
  exports: [
    ...modules,

    MapComponent,
    LoginComponent,
    NavbarComponent,
    DialogInfoComponent,
    DialogResultComponent,
  ],

  //===========================================================
  // PROVIDERS
  //===========================================================
  providers: [
    MqttEventsService,
    MapService,
    AuthService,
  ],

})
export class SharedModule { }
