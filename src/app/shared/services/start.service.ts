import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogUnitGenericComponent } from 'src/app/modules/unit/unit-generic/components/dialog-unit-generic/dialog-unit-generic.component';
import { UnitGenericFactory } from 'src/app/modules/unit/unit-generic/unit-generic.factory';
import { UnitGenericService } from 'src/app/modules/unit/unit-generic/unit-generic.service';
import { DialogUnitHydrantComponent } from 'src/app/modules/unit/unit-hydrant/components/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { UnitHydrantFactory } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.factory';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { DialogUnitPondComponent } from 'src/app/modules/unit/unit-pond/components/dialog-unit-pond/dialog-unit-pond.component';
import { UnitPondFactory } from 'src/app/modules/unit/unit-pond/unit-pond.factory';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { SectorService } from 'src/app/modules/wrap/sector/sector.service';
import { SetService } from 'src/app/modules/wrap/set/set.service';
import { DialogUnitStationPechinaComponent } from './../../modules/unit/unit-station-pechina/components/dialog-unit-station-pechina/dialog-unit-station-pechina/dialog-unit-station-pechina.component';
import { UnitStationPechinaFactoryService } from './../../modules/unit/unit-station-pechina/unit-station-pechina-factory.service';
import { UnitStationPechinaService } from './../../modules/unit/unit-station-pechina/unit-station-pechina.service';

@Injectable({
  providedIn: 'root',
})
export class StartService implements OnDestroy {
  // ==================================================
  //  VARS SUBSCRIPTIONS
  // ==================================================
  private _subStations: Subscription;
  private _subUnitGenerics: Subscription;
  private _subUnitHydrants: Subscription;
  private _subUnitPonds: Subscription;
  private _subUnitStationPechina: Subscription;
  private _subUnitHydrantMarkerChange: Subscription;
  private _subUnitGenericMarkerChange: Subscription;
  private _subUnitPondMarkerChange: Subscription;
  private _subUnitStationPechinaMarkerChange: Subscription;

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _matDialog: MatDialog,
    // Services
    private readonly _unitGenericService: UnitGenericService,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitPondService: UnitPondService,
    private readonly _unitStationPechinaService: UnitStationPechinaService,
    private readonly _sectorService: SectorService,
    private readonly _setService: SetService,
    // Factories
    private readonly _unitHydrantFactory: UnitHydrantFactory,
    private readonly _unitGenericFactory: UnitGenericFactory,
    private readonly _unitPondFactory: UnitPondFactory,
    private readonly _unitStationPechinaFactory: UnitStationPechinaFactoryService
  ) {
    this.subscribeToUnitsGenerics();
    this.subscribeToUnitsHydrants();
    this.subscribeToUnitsPonds();
    this.subscribeToUnitStationPechina();

    this.subscribeToUnitsGenericsMarkerChange();
    this.subscribeToUnitsHydrantsMarkerChange();
    this.subscribeToUnitsPondsMarkerChange();
    this.subscribeToUnitStationPechinaMarkerChange();

    this._unitGenericService.findAll();
    this._unitHydrantService.findAll();
    this._unitPondService.findAll();
    this._unitStationPechinaService.find();
    this._sectorService.findAll();
    this._setService.findAll();
  }

  // ==================================================
  //  SUBSCRIBE TO UNITS GENERICS
  // ==================================================
  private subscribeToUnitsGenerics(): void {
    this._subUnitGenerics = this._unitGenericService
      .getUnitsGeneric()
      .subscribe((unitsGenerics) => {
        unitsGenerics.forEach((unitGeneric) => {
          unitGeneric.marker.getElement().onclick = () =>
            this._matDialog.open(DialogUnitGenericComponent, {
              data: unitGeneric,
            });
        });
      });
  }

  private subscribeToUnitsGenericsMarkerChange(): void {
    this._subUnitGenericMarkerChange = this._unitGenericFactory
      .getMarkerChange()
      .subscribe((unitGeneric) => {
        if (unitGeneric !== null) {
          unitGeneric.marker.getElement().onclick = () => {
            this._matDialog.open(DialogUnitGenericComponent, {
              data: unitGeneric,
            });
          };
        }
      });
  }

  // ==================================================
  //  SBUSCRIBE TO UNITS HYDRANTS
  // ==================================================
  private subscribeToUnitsHydrants(): void {
    this._subUnitHydrants = this._unitHydrantService
      .getUnitsHydrants()
      .subscribe((unitsHydrants) => {
        unitsHydrants.forEach((unitHydrant) => {
          unitHydrant.marker.getElement().onclick = () =>
            this._matDialog.open(DialogUnitHydrantComponent, {
              data: unitHydrant,
              maxWidth: '800px',
            });
        });
      });
  }

  private subscribeToUnitsHydrantsMarkerChange(): void {
    this._subUnitHydrantMarkerChange = this._unitHydrantFactory
      .getMarkerChange()
      .subscribe((unitHydrant) => {
        if (unitHydrant !== null) {
          unitHydrant.marker.getElement().onclick = () => {
            this._matDialog.open(DialogUnitHydrantComponent, {
              data: unitHydrant,
              maxWidth: '800px',
            });
          };
        }
      });
  }

  // ==================================================
  //  SUBSCRIBE TO UNITS PONDS
  // ==================================================
  private subscribeToUnitsPonds(): void {
    this._subUnitPonds = this._unitPondService
      .getUnitsPonds()
      .subscribe((unitsPonds) => {
        unitsPonds.forEach((unitPond) => {
          unitPond.marker.getElement().onclick = () =>
            this._matDialog.open(DialogUnitPondComponent, { data: unitPond });
        });
      });
  }

  private subscribeToUnitsPondsMarkerChange(): void {
    this._subUnitPondMarkerChange = this._unitPondFactory
      .getMarkerChange()
      .subscribe((unitPond) => {
        if (unitPond !== null) {
          unitPond.marker.getElement().onclick = () => {
            this._matDialog.open(DialogUnitPondComponent, {
              data: unitPond,
            });
          };
        }
      });
  }

  // ==================================================
  //  SUBSCRIBE TO UNIT STATION PECHINA
  // ==================================================
  private subscribeToUnitStationPechina(): void {
    this._subUnitStationPechina = this._unitStationPechinaService
      .getUnitStationPechina()
      .subscribe((unitStationPechina) => {
        if (unitStationPechina && unitStationPechina.marker) {
          unitStationPechina.marker.getElement().onclick = () => {
            this._matDialog.open(DialogUnitStationPechinaComponent, {
              data: unitStationPechina,
            });
          };
        }
      });
  }

  private subscribeToUnitStationPechinaMarkerChange(): void {
    this._subUnitStationPechinaMarkerChange = this._unitStationPechinaFactory
      .getMarkerChange()
      .subscribe((unitStationPechina) => {
        if (unitStationPechina !== null) {
          unitStationPechina.marker.getElement().onclick = () => {
            this._matDialog.open(DialogUnitStationPechinaComponent, {
              data: unitStationPechina,
            });
          };
        }
      });
  }

  // ==================================================
  //  LIFE CYCLE
  // ==================================================
  ngOnDestroy(): void {
    if (this._subStations) {
      this._subStations.unsubscribe();
    }
    if (this._subUnitGenerics) {
      this._subUnitGenerics.unsubscribe();
    }
    if (this._subUnitHydrants) {
      this._subUnitHydrants.unsubscribe();
    }
    if (this._subUnitPonds) {
      this._subUnitPonds.unsubscribe();
    }
    if (this._subUnitHydrantMarkerChange) {
      this._subUnitHydrantMarkerChange.unsubscribe();
    }
    if (this._subUnitGenericMarkerChange) {
      this._subUnitGenericMarkerChange.unsubscribe();
    }
    if (this._subUnitPondMarkerChange) {
      this._subUnitPondMarkerChange.unsubscribe();
    }
    if (this._subUnitStationPechina) {
      this._subUnitStationPechina.unsubscribe();
    }
    if (this._subUnitStationPechinaMarkerChange) {
      this._subUnitStationPechinaMarkerChange.unsubscribe();
    }
  }
}
