import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
import { UnitGenericEntity } from '../../unit-generic.entity';
import { UnitGenericService } from '../../unit-generic.service';
import { DialogUnitGenericCreateComponent } from '../dialog-unit-generic-create/dialog-unit-generic-create.component';

@Component({
  selector: 'app-dialog-unit-generic',
  templateUrl: './dialog-unit-generic.component.html',
})
export class DialogUnitGenericComponent implements OnInit {

  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;

  constructor(
    private readonly _mqttEventService: MqttEventsService,
    private readonly _matDialog: MatDialog,
    private readonly _unitGenericService: UnitGenericService,
    @Inject(MAT_DIALOG_DATA)
    public unitGeneric: UnitGenericEntity
  ) { }

  ngOnInit() {
    //console.log(this.unitHydrant);
  }

  ngOnDestroy() {
    this.unitGeneric = null;
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  openDialogGenericCreate() {
    this._matDialog.open(DialogUnitGenericCreateComponent, { data: this.unitGeneric });
  }

}
