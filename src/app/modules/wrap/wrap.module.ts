// ===========================================================
//  MODULES
// ===========================================================
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DialogSectorCreateComponent } from './sector/components/dialog-sector-create/dialog-sector-create.component';
import { DialogSectorComponent } from './sector/components/dialog-sector/dialog-sector.component';
// ==================================================
// COMPONENTS
// ==================================================
import { PageSectorComponent } from './sector/components/page-sector/page-sector.component';
import { SectorActiveFilterPipe } from './sector/sector-active-filter.pipe';
import { SectorFilterPipe } from './sector/sector-filter.pipe';
import { SectorService } from './sector/sector.service';
import { DialogSetCreateComponent, DialogSetTypeCreateComponent, DialogSetTypeDeleteComponent } from './set/components/dialog-set-create/dialog-set-create.component';
import { DialogSetComponent } from './set/components/dialog-set/dialog-set.component';
import { PageSetComponent } from './set/components/page-set/page-set.component';
// ===========================================================
//  SERVICES
// ===========================================================
import { SetService } from './set/set.service';
import { SetActiveFilterPipe } from './set/set-active-filter.pipe';
import { SetFilterPipe } from './set/set-filter.pipe';

@NgModule({
  // ==================================================
  // DECLARATIONS
  // ==================================================
  declarations: [
    PageSectorComponent,
    DialogSectorComponent,
    DialogSectorCreateComponent,
    PageSetComponent,
    DialogSetComponent,
    DialogSetCreateComponent,
    DialogSetTypeCreateComponent,
    DialogSetTypeDeleteComponent,
    SectorActiveFilterPipe,
    SectorFilterPipe,
    SetActiveFilterPipe,
    SetFilterPipe
  ],
  // ==================================================
  // IMPORTS
  // ==================================================
  imports: [CommonModule, SharedModule],
  // ==================================================
  // PROVIDERS
  // ==================================================
  providers: [SectorService, SetService],
})
export class WrapModule {}
