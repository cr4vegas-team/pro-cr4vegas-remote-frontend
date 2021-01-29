import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { AuthService } from '../modules/auth/auth/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { DialogImageComponent } from './components/dialog-image/dialog-image.component';
import { DialogInfoComponent } from './components/dialog-info/dialog-info.component';
import { DialogResultComponent } from './components/dialog-result/dialog-result.component';
import { PondComponent } from './components/elements/pond/pond.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/page-login/page-login.component';
import { MapComponent } from './components/page-map/page-map.component';
import { MaterialModule } from './material.module';
import { EnumToArrayPipe } from './pipes/enum-to-array.pipe';
import { FilterActivePipe } from './pipes/filter-active.pipe';
import { FilterTextPipe } from './pipes/filter-text.pipe';
import { MapService } from './services/map.service';
import { RoleAdminDirective } from './directives/role-admin.directive';
import { RoleModeratorDirective } from './directives/role-moderator.directive';

const modules = [MaterialModule, ChartsModule, AppRoutingModule];

@NgModule({
  declarations: [
    MapComponent,
    LoginComponent,
    NavbarComponent,
    DialogInfoComponent,
    DialogResultComponent,
    DialogImageComponent,
    DialogConfirmComponent,
    PondComponent,
    FilterActivePipe,
    FilterTextPipe,
    EnumToArrayPipe,
    RoleAdminDirective,
    RoleModeratorDirective,
  ],
  // ===========================================================
  //  IMPORTS
  // ===========================================================
  imports: [...modules],
  // ===========================================================
  //  EXPORTS
  // ===========================================================
  exports: [
    ...modules,

    MapComponent,
    LoginComponent,
    NavbarComponent,
    DialogInfoComponent,
    DialogResultComponent,
    PondComponent,
    FilterActivePipe,
    FilterTextPipe,
    EnumToArrayPipe,
    RoleAdminDirective,
    RoleModeratorDirective,
  ],

  // ===========================================================
  //  PROVIDERS
  // ===========================================================
  providers: [MapService, AuthService],
})
export class SharedModule {}
