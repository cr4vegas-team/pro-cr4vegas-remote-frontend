import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { Hydrant } from '../../../models/hydrant';
import { MqttEventsService } from '../../../services/mqtt-events.service';
import { CONS_DIALOG_INFO } from '../dialog-info/dialog-info.constants';

@Component({
  selector: 'app-dialog-hydrant',
  templateUrl: './dialog-hydrant.component.html',
  styleUrls: ['./dialog-hydrant.component.css']
})
export class DialogHydrantComponent {

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _mqttEventService: MqttEventsService,
    @Inject(MAT_DIALOG_DATA)
    public data: Hydrant
  ) { }

  openDialogInfo() {
    this._dialog.open(DialogInfoComponent, { data: CONS_DIALOG_INFO.NOT_AVAILABLE });
  }

  openValve() {
    this._mqttEventService.publish(this.data.code, '1');
    this.data.valve = true;
  }

  closeValve() {
    this._mqttEventService.publish(this.data.code, '0');
    this.data.valve = false;
  }

}
