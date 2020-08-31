import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnitPondEntity } from 'src/app/models/unit-pond.entity';
import { UnitPondService } from 'src/app/services/api/unit-pond.service';
import { MqttEventsService } from 'src/app/services/mqtt-events.service';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { CONS_DIALOG_INFO } from '../dialog-info/dialog-info.constants';
import { DialogUnitPondCreateComponent } from '../dialog-unit-pond-create/dialog-unit-pond-create.component';

@Component({
  selector: 'app-dialog-unit-pond',
  templateUrl: './dialog-unit-pond.component.html',
  styleUrls: ['./dialog-unit-pond.component.css']
})
export class DialogUnitPondComponent implements OnInit {

  consDialogInfo = CONS_DIALOG_INFO;

  constructor(
    private readonly _matDialog: MatDialog,
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
