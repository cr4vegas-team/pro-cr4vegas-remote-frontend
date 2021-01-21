import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorTypeEnum } from './../../constants/error-type.enum';
import { IDialogInfoData } from './dialog-info-data.interface';

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
})
export class DialogInfoComponent implements OnInit {
  html = '';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: IDialogInfoData
  ) {}

  ngOnInit(): void {
    const errorType = this.data.errorType;
    if (errorType === ErrorTypeEnum.API_ERROR) {
      this.editHTMLWithApiError();
    }
    if (errorType === ErrorTypeEnum.FRONT_ERROR) {
      this.editHTMLWithFrontError();
    }
    document.getElementById('html').innerHTML = this.html;
  }

  editHTMLWithApiError(): void {
    console.log(this.data);
    this.html += '<h3>Datos enviados incorrectos</h3>';
    this.html += '<ul>';
    if (Array.isArray(this.data.html.error.message)) {
      for (const line of this.data.html.error.message) {
        this.html += `<li>${line}</li>`;
      }
    } else {
      this.html += this.data.html.error.message;
    }

    this.html += '</ul>';
  }

  editHTMLWithFrontError(): void {
    this.html = this.data.html;
  }
}
