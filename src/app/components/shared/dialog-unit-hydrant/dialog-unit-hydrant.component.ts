import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MqttEventsService } from '../../../services/mqtt-events.service';
import { UnitHydrantEntity } from '../../../models/unit-hydrant.entity';
import { DialogUnitHydrantCreateComponent } from '../dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { CONS_DIALOG_INFO } from '../dialog-info/dialog-info.constants';
import { TopicTypeEnum } from '../../../constants/topic-type.enum';

@Component({
  selector: 'app-dialog-unit-hydrant',
  templateUrl: './dialog-unit-hydrant.component.html',
  styleUrls: ['./dialog-unit-hydrant.component.css']
})
export class DialogUnitHydrantComponent implements OnInit {

  consDialogInfo = CONS_DIALOG_INFO;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _mqttEventService: MqttEventsService,
    private readonly _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public unitHydrant: UnitHydrantEntity
  ) { }

  ngOnInit() {
    console.log(this.unitHydrant);
  }

  openDialogInfo(data: string) {
    this._dialog.open(DialogInfoComponent, { data });
  }

  openValve() {
    this._mqttEventService.publish(TopicTypeEnum.UNIT_HYDRANT, this.unitHydrant.code, '1');
    this.unitHydrant.valve = true;
  }

  closeValve() {
    this._mqttEventService.publish(TopicTypeEnum.UNIT_HYDRANT, this.unitHydrant.code, '0');
    this.unitHydrant.valve = false;
  }

  openDialogHydrantCreate() {
    this._matDialog.open(DialogUnitHydrantCreateComponent, { data: this.unitHydrant });
  }

}
