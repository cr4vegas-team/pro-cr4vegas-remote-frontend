// ===========================================================
//  MODULES
// ===========================================================
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
// ==================================================
// COMPONENTS
// ==================================================
import { DialogUnitGenericCreateComponent } from './unit-generic/components/dialog-unit-generic-create/dialog-unit-generic-create.component';
import { DialogUnitGenericComponent } from './unit-generic/components/dialog-unit-generic/dialog-unit-generic.component';
import { PageUnitGenericComponent } from './unit-generic/components/page-unit-generic/page-unit-generic.component';
import { DialogUnitHydrantCreateComponent } from './unit-hydrant/components/dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';
import { DialogUnitHydrantComponent } from './unit-hydrant/components/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { PageUnitHydrantComponent } from './unit-hydrant/components/page-unit-hydrant/page-unit-hydrant.component';
import { DialogUnitPondCreateComponent } from './unit-pond/components/dialog-unit-pond-create/dialog-unit-pond-create.component';
import { DialogUnitPondComponent } from './unit-pond/components/dialog-unit-pond/dialog-unit-pond.component';
import { PageUnitPondComponent } from './unit-pond/components/page-unit-pond/page-unit-pond.component';
// ===========================================================
//  SERVICES
// ===========================================================
import { UnitGenericService } from './unit-generic/unit-generic.service';
import { UnitHydrantService } from './unit-hydrant/unit-hydrant.service';
import { UnitPondService } from './unit-pond/unit-pond.service';
import { UnitFactory } from './unit/unit.factory';
import { UnitService } from './unit/unit.service';

@NgModule({
  // ==================================================
  // DECLARATIONS
  // ==================================================
  declarations: [
    PageUnitGenericComponent,
    DialogUnitGenericComponent,
    DialogUnitGenericCreateComponent,
    PageUnitHydrantComponent,
    DialogUnitHydrantComponent,
    DialogUnitHydrantCreateComponent,
    PageUnitPondComponent,
    DialogUnitPondComponent,
    DialogUnitPondCreateComponent,
  ],
  // ==================================================
  // IMPORTS
  // ==================================================
  imports: [CommonModule, SharedModule],
  // ==================================================
  // PROVIDERS
  // ==================================================
  providers: [
    UnitHydrantService,
    UnitPondService,
    UnitGenericService,
    UnitService,
    UnitFactory,
  ],
})
export class UnitModule {}
