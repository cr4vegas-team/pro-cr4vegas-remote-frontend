import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { UserDto } from '../../dto/user-response.dto';
import { DialogUserCreateComponent } from '../dialog-user-create/dialog-user-create.component';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
})
export class DialogUserComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDto,
    private readonly _matDialog: MatDialog
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  openDialogUserCreate(): void {
    this._matDialog
      .open(DialogUserCreateComponent, { data: this.data, maxWidth: '400px' })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.data = res;
        }
      });
  }
}
