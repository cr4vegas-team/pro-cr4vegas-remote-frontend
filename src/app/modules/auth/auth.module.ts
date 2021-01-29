import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleDirective } from './user/directives/role.directive';
import { PageUserComponent } from './user/components/page-user/page-user.component';
import { DialogUserComponent } from './user/components/dialog-user/dialog-user.component';
import { DialogUserCreateComponent } from './user/components/dialog-user-create/dialog-user-create.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    RoleDirective,
    PageUserComponent,
    DialogUserComponent,
    DialogUserCreateComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],

  exports: [RoleDirective],
})
export class AuthModule {}
