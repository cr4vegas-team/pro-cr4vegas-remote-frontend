import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from '../../shared/material.module';
// ==================================================
// COMPONENTS
// ==================================================
import { PageSectorComponent } from './sector/components/page-sector/page-sector.component';
import { DialogSectorCreateComponent } from './sector/components/dialog-sector-create/dialog-sector-create.component';
import { DialogSectorComponent } from './sector/components/dialog-sector/dialog-sector.component';
import { SectorService } from './sector/sector.service';
import { PageSetComponent } from './set/components/page-set/page-set.component';
import { DialogSetCreateComponent } from './set/components/dialog-set-create/dialog-set-create.component';
import { DialogSetComponent } from './set/components/dialog-set/dialog-set.component';
import { SetService } from './set/set.service';
import { PageStationComponent } from './station/components/page-station/page-station.component';
import { DialogStationCreateComponent } from './station/components/dialog-station-create/dialog-station-create.component';
import { DialogStationComponent } from './station/components/dialog-station/dialog-station.component';
import { StationService } from './station/station.service';


@NgModule({
  // ==================================================
  // DECLARATIONS
  // ==================================================

  declarations: [
    PageSectorComponent,
    DialogSectorComponent,
    DialogSectorCreateComponent,
    PageStationComponent,
    DialogStationComponent,
    DialogStationCreateComponent,
    PageSetComponent,
    DialogSetComponent,
    DialogSetCreateComponent,
  ],

  // ==================================================
  // IMPORTS
  // ==================================================

  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
  ],

  // ==================================================
  // PROVIDERS
  // ==================================================

  providers: [
    StationService,
    SectorService,
    SetService,
  ],
})
export class WrapModule { }
