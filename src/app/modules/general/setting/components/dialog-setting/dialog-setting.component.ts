import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingEntity } from './../../setting.entity';
import { DialogSettingCreateComponent } from './../dialog-setting-create/dialog-setting-create.component';

@Component({
  selector: 'app-dialog-setting',
  templateUrl: './dialog-setting.component.html',
})
export class DialogSettingComponent implements OnInit {

  constructor(
    private readonly _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public setting: SettingEntity
  ) { }

  ngOnInit(): void {
  }

  openDialogSettingCreate(): void {
    this._matDialog.open(DialogSettingCreateComponent, { data: this.setting});
  }
}
