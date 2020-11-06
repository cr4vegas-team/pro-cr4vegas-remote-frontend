import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageAlarmComponent } from './alarm/components/page-alarm/page-alarm.component';
import { DialogOrderCreateComponent } from './order/components/dialog-order-create/dialog-order-create.component';
import { DialogOrderComponent } from './order/components/dialog-order/dialog-order.component';
import { PageRegistryComponent } from './registry/components/page-registry/page-registry.component';
import { PageSessionComponent } from './session/components/page-session/page-session.component';
import { PageActionComponent } from './action/components/page-action/page-action.component';
import { PageOrderComponent } from './order/components/page-order/page-order.component';

@NgModule({
  declarations: [
    PageSessionComponent,
    PageAlarmComponent,
    DialogOrderCreateComponent,
    DialogOrderComponent,
    PageRegistryComponent,
    PageActionComponent,
    PageOrderComponent,
  ],
  imports: [CommonModule, SharedModule],
})
export class SessionModule {}
