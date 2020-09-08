import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { AuthService } from './services/auth.service';
import { MapService } from './services/map.service';
import { MqttEventsService } from './services/mqtt-events.service';
import { DialogService } from './services/dialog.service';

@NgModule({

  exports: [
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
  ],

  providers: [
    MqttEventsService,
    MapService,
    AuthService,
    DialogService,
  ],

})
export class SharedModule { }
