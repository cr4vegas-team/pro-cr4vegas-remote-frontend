import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TopicTypeEnum } from 'src/app/constants/topic-type.enum';
import { UnitPondEntity } from 'src/app/models/unit-pond.entity';
import { UnitPondService } from 'src/app/services/api/unit-pond.service';
import { MqttEventsService } from 'src/app/services/mqtt-events.service';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { CONS_DIALOG_INFO } from '../dialog-info/dialog-info.constants';

@Component({
  selector: 'app-dialog-unit-pond-create',
  templateUrl: './dialog-unit-pond-create.component.html',
  styleUrls: ['./dialog-unit-pond-create.component.css']
})
export class DialogUnitPondCreateComponent implements OnInit, OnDestroy {

  consDialogInfo = CONS_DIALOG_INFO;

  constructor(
    private readonly _mqttEventService: MqttEventsService,
    private readonly _matDialog: MatDialog,
    private readonly _unitHydrantService: UnitPondService,
    @Inject(MAT_DIALOG_DATA)
    public unitPond: UnitPondEntity
  ) { }

  ngOnInit() {
    //console.log(this.unitHydrant);
  }

  ngOnDestroy() {
    this.unitPond = null;
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  openDialogUnitPondCreate() {
    this._matDialog.open(DialogUnitPondCreateComponent, { data: this.unitPond });
  }

}
