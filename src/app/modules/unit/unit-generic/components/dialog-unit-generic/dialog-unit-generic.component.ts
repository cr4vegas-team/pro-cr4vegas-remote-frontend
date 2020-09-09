import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { UnitGenericEntity } from '../../unit-generic.entity';
import { DialogUnitGenericCreateComponent } from '../dialog-unit-generic-create/dialog-unit-generic-create.component';

@Component({
  selector: 'app-dialog-unit-generic',
  templateUrl: './dialog-unit-generic.component.html',
})
export class DialogUnitGenericComponent implements OnInit {

  consDialogInfo = GLOBAL.FUNCTION_NOT_ALLOWED;

  constructor(
    private readonly _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public unitGeneric: UnitGenericEntity
  ) { }

  ngOnInit() { }

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
