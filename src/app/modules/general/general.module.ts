import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { DialogSettingCreateComponent } from './setting/components/dialog-setting-create/dialog-setting-create.component';
import { DialogSettingComponent } from './setting/components/dialog-setting/dialog-setting.component';

@NgModule({
  declarations: [DialogSettingCreateComponent, DialogSettingComponent],
  imports: [CommonModule, SharedModule],
})
export class GeneralModule {}
