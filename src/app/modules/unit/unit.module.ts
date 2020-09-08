import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitGenericService } from './unit-generic/unit-generic.service';
import { UnitHydrantService } from './unit-hydrant/unit-hydrant.service';
import { UnitPondService } from './unit-pond/unit-pond.service';
import { SharedModule } from '../../shared/shared.module';
import { UnitFactory } from './unit/unit.factory';

// ==================================================
// COMPONENTS
// ==================================================

import { PageUnitGenericComponent } from './unit-generic/components/page-unit-generic/page-unit-generic.component';
import { DialogUnitGenericComponent } from './unit-generic/components/dialog-unit-generic/dialog-unit-generic.component';
import { DialogUnitGenericCreateComponent } from './unit-generic/components/dialog-unit-generic-create/dialog-unit-generic-create.component';
import { PopupUnitGenericComponent } from './unit-generic/components/popup-unit-generic/popup-unit-generic.component';

import { PageUnitHydrantComponent } from './unit-hydrant/components/page-unit-hydrant/page-unit-hydrant.component';
import { DialogUnitHydrantComponent } from './unit-hydrant/components/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { DialogUnitHydrantCreateComponent } from './unit-hydrant/components/dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';
import { PopupUnitHydrantComponent } from './unit-hydrant/components/popup-unit-hydrant/popup-unit-hydrant.component';

import { PageUnitPondComponent } from './unit-pond/components/page-unit-pond/page-unit-pond.component';
import { DialogUnitPondComponent } from './unit-pond/components/dialog-unit-pond/dialog-unit-pond.component';
import { DialogUnitPondCreateComponent } from './unit-pond/components/dialog-unit-pond-create/dialog-unit-pond-create.component';
import { PopupUnitPondComponent } from './unit-pond/components/popup-unit-pond/popup-unit-pond.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { UnitService } from './unit/unit.service';


@NgModule({

  // ==================================================
  // DECLARATIONS
  // ==================================================

  declarations: [
    PageUnitGenericComponent,
    DialogUnitGenericComponent,
    DialogUnitGenericCreateComponent,
    PopupUnitGenericComponent,
    PageUnitHydrantComponent,
    DialogUnitHydrantComponent,
    DialogUnitHydrantCreateComponent,
    PopupUnitHydrantComponent,
    PageUnitPondComponent,
    DialogUnitPondComponent,
    DialogUnitPondCreateComponent,
    PopupUnitPondComponent,
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
    UnitService,
    UnitFactory,
    UnitHydrantService,
    UnitPondService,
    UnitGenericService,
  ],
})
export class UnitModule { }
