import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogInfoComponent } from '../../../../../shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../../../shared/constants/global.constant';
import { TopicTypeEnum } from '../../../../../shared/constants/topic-type.enum';
import { MqttEventsService } from '../../../../../shared/services/mqtt-events.service';
import { UnitHydrantEntity } from '../../unit-hydrant.entity';
import { UnitHydrantService } from '../../unit-hydrant.service';
import { DialogUnitHydrantCreateComponent } from '../dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';



@Component({
  selector: 'app-dialog-unit-hydrant',
  templateUrl: './dialog-unit-hydrant.component.html',
})
export class DialogUnitHydrantComponent implements OnInit, OnDestroy {

  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;

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
    this._mqttEventService.publish(TopicTypeEnum.UNIT_HYDRANT, this.unitHydrant.id, '1');
    this.unitHydrant.valve = 1;
    this._unitHydrantService.updateUnitsHydrants();
  }

  closeValve() {
    this._mqttEventService.publish(TopicTypeEnum.UNIT_HYDRANT, this.unitHydrant.id, '0');
    this.unitHydrant.valve = 0;
    this._unitHydrantService.updateUnitsHydrants();
  }

  openDialogHydrantCreate() {
    this._matDialog.open(DialogUnitHydrantCreateComponent, { data: this.unitHydrant });
  }

}
