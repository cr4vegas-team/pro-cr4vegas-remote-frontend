import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

@NgModule({

  exports: [
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
  ]

})
export class SharedModule { }
