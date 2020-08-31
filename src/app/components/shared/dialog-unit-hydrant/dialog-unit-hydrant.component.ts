import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnitHydrantService } from 'src/app/services/api/unit-hydrant.service';
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
    private readonly _unitHydrantService: UnitHydrantService,
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
    this._matDialog.open(DialogInfoComponent, { data });
  }

  openValve() {
    this._mqttEventService.publish(TopicTypeEnum.UNIT_HYDRANT, this.unitHydrant.getId(), '1');
    this._unitHydrantService.setValve(this.unitHydrant, true);
  }

  closeValve() {
    this._mqttEventService.publish(TopicTypeEnum.UNIT_HYDRANT, this.unitHydrant.getId(), '0');
    this._unitHydrantService.setValve(this.unitHydrant, false);
  }

  openDialogHydrantCreate() {
    this._matDialog.open(DialogUnitHydrantCreateComponent, { data: this.unitHydrant });
  }

}
