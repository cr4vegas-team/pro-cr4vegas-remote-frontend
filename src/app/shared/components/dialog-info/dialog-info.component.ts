import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogInfoData } from './dialog-info-component.data';

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
})
export class DialogInfoComponent {
  title;
  html;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: IDialogInfoData
  ) {
    this.title = data.title;
    this.html = data.html;
  }
}
