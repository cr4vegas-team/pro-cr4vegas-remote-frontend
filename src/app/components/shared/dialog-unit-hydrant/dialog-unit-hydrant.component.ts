import { Component, forwardRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TopicTypeEnum } from '../../../constants/topic-type.enum';
import { UnitHydrantEntity } from '../../../models/unit-hydrant.entity';
import { MqttEventsService } from '../../../services/mqtt-events.service';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { CONS_DIALOG_INFO } from '../dialog-info/dialog-info.constants';
import { DialogUnitHydrantCreateComponent } from '../dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';

@Component({
  selector: 'app-dialog-unit-hydrant',
  templateUrl: './dialog-unit-hydrant.component.html',
  styleUrls: ['./dialog-unit-hydrant.component.css'],
})
export class DialogUnitHydrantComponent implements OnInit, OnDestroy {

  consDialogInfo = CONS_DIALOG_INFO;

  constructor(
    private readonly _mqttEventService: MqttEventsService,
    private readonly _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public unitHydrant: UnitHydrantEntity
  ) { }

  ngOnInit() {
    //console.log(this.unitHydrant);
  }

  ngOnDestroy() {
    this.unitHydrant = null;
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data, maxWidth: '70%' });
  }

  openValve() {
    this._mqttEventService.publish(TopicTypeEnum.UNIT_HYDRANT, this.unitHydrant.getCode(), '1');
    this.unitHydrant.setValve(true);
  }

  closeValve() {
    this._mqttEventService.publish(TopicTypeEnum.UNIT_HYDRANT, this.unitHydrant.getCode(), '0');
    this.unitHydrant.setValve(false);
  }

  openDialogHydrantCreate() {
    this._matDialog.open(DialogUnitHydrantCreateComponent, { data: this.unitHydrant, maxWidth: '70%' });
  }

}
