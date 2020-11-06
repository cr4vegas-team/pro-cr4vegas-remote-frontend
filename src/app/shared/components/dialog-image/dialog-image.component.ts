import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-image',
  templateUrl: './dialog-image.component.html',
})
export class DialogImageComponent implements OnInit {
  imageURL: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: string
  ) {}

  ngOnInit(): void {
    this.imageURL = this.data;
  }
}
