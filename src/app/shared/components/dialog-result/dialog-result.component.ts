import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogResultData } from './dialog-result-data.class';

@Component({
  selector: 'app-dialog-result',
  templateUrl: './dialog-result.component.html',
})
export class DialogResultComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogResultData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
