import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
})
export class DialogInfoComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) { }

  ngOnInit(): void {
    const divContent = document.getElementById('info-content');
    divContent.innerHTML = this.data.html;
  }

}
