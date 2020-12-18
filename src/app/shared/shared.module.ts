import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { DialogImageComponent } from './components/dialog-image/dialog-image.component';
import { DialogInfoComponent } from './components/dialog-info/dialog-info.component';
import { DialogResultComponent } from './components/dialog-result/dialog-result.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/page-login/page-login.component';
import { MapComponent } from './components/page-map/page-map.component';
import { MaterialModule } from './material.module';
import { AuthService } from './services/auth.service';
import { MapService } from './services/map.service';

const modules = [MaterialModule, ChartsModule, AppRoutingModule];

@NgModule({
  declarations: [
    MapComponent,
    LoginComponent,
    NavbarComponent,
    DialogInfoComponent,
    DialogResultComponent,
    DialogImageComponent,
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
  ],

  // ===========================================================
  //  PROVIDERS
  // ===========================================================
  providers: [MapService, AuthService],
})
export class SharedModule {}
