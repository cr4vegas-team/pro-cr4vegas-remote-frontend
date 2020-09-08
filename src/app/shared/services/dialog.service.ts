import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '../components/dialog-info/dialog-info.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private readonly _matDialog: MatDialog,
  ) { }

  public openDialogInfo(title: string, html: string) {
    this._matDialog.open(DialogInfoComponent, { data: { title, html } });
  }

  public openDialogInfoWithAPIException(exception: any) {
    console.log(exception);
    this._matDialog.open(DialogInfoComponent, { data: { title: 'Error', html: exception.error.description } });
  }
}
