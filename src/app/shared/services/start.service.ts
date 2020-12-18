import { UnitHydrantSocketService } from './../../modules/unit/unit-hydrant/unit-hydrant-socket.service';
import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogUnitGenericComponent } from 'src/app/modules/unit/unit-generic/components/dialog-unit-generic/dialog-unit-generic.component';
import { UnitGenericEntity } from 'src/app/modules/unit/unit-generic/unit-generic.entity';
import { UnitGenericFactory } from 'src/app/modules/unit/unit-generic/unit-generic.factory';
import { UnitGenericService } from 'src/app/modules/unit/unit-generic/unit-generic.service';
import { DialogUnitHydrantComponent } from 'src/app/modules/unit/unit-hydrant/components/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { UnitHydrantEntity } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.entity';
import { UnitHydrantFactory } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.factory';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { DialogUnitPondComponent } from 'src/app/modules/unit/unit-pond/components/dialog-unit-pond/dialog-unit-pond.component';
import { UnitPondEntity } from 'src/app/modules/unit/unit-pond/unit-pond.entity';
import { UnitPondFactory } from 'src/app/modules/unit/unit-pond/unit-pond.factory';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { SectorEntity } from 'src/app/modules/wrap/sector/sector.entity';
import { SectorFactory } from 'src/app/modules/wrap/sector/sector.factory';
import { SectorService } from 'src/app/modules/wrap/sector/sector.service';
import { SetEntity } from 'src/app/modules/wrap/set/set.entity';
import { SetFactory } from 'src/app/modules/wrap/set/set.factory';
import { SetService } from 'src/app/modules/wrap/set/set.service';
import { DialogStationComponent } from 'src/app/modules/wrap/station/components/dialog-station/dialog-station.component';
import { StationEntity } from 'src/app/modules/wrap/station/station.entity';
import { StationFactory } from 'src/app/modules/wrap/station/station.factory';
import { StationService } from 'src/app/modules/wrap/station/station.service';
import { AuthService } from 'src/app/shared/services/auth.service';

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
  private _subUnitHydrantMarkerChange: Subscription;
  private _subUnitGenericMarkerChange: Subscription;
  private _subUnitPondMarkerChange: Subscription;

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _authService: AuthService,
    private readonly _matDialog: MatDialog,
    private readonly _unitGenericService: UnitGenericService,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitHydrantSocketService: UnitHydrantSocketService,
    private readonly _unitPondService: UnitPondService,
    private readonly _stationService: StationService,
    private readonly _sectorService: SectorService,
    private readonly _unitHydrantFactory: UnitHydrantFactory,
    private readonly _unitGenericFactory: UnitGenericFactory,
    private readonly _unitPondFactory: UnitPondFactory,
    private readonly _stationFactory: StationFactory,
    private readonly _sectorFactory: SectorFactory,
    private readonly _setFactory: SetFactory,
    private readonly _setService: SetService
  ) {
    this._authService.getSubjectUserRole().subscribe((res) => {
      if (res !== null) {
        this.initStations();
        this.initSectors();
        this.initSets();
        this.initUnitsGenerics();
        this.initUnitsHydrants();
        this.initUnitsPonds();
      }
    });
  }

  // ==================================================
  //  INIT & SUBSCRIBE STATIONS
  // ==================================================
  private initStations(): void {
    this.findStations();
    this.subscribeToStations();
  }

  private findStations(): void {
    this._stationService.findAll().subscribe(
      (stationsRO) => {
        this._stationService.cleanAll();
        stationsRO.stations.forEach((station: StationEntity) => {
          const newStation: StationEntity = this._stationFactory.createStation(
            station
          );
          newStation.marker.getElement().onclick = () =>
            this._matDialog.open(DialogStationComponent, { data: newStation });
          this._stationService.getStations().value.push(newStation);
        });
        this._stationService.refresh();
      },
      (error) => {
        throw new Error(error);
      }
    );
  }

  private subscribeToStations(): void {
    this._subStations = this._stationService
      .getStations()
      .subscribe((stations) => {
        stations.forEach((station) => {
          station.marker.getElement().onclick = () =>
            this._matDialog.open(DialogStationComponent, { data: station });
        });
      });
  }

  // ==================================================
  //  INIT & SUBSCRIBE SECTORS
  // ==================================================
  private initSectors(): void {
    this.findSectors();
  }

  private findSectors(): void {
    this._sectorService.findAll().subscribe(
      (sectorsRO) => {
        this._sectorService.cleanAll();
        sectorsRO.sectors.forEach((sector: SectorEntity) => {
          const newSector: SectorEntity = this._sectorFactory.createSector(
            sector
          );
          this._sectorService.getSectors().value.push(newSector);
        });
        this._sectorService.refresh();
      },
      (error) => {
        throw new Error(error);
      }
    );
  }

  // ==================================================

  private initSets(): void {
    this.findSets();
  }

  private findSets(): void {
    this._setService.findAll().subscribe(
      (setsRO) => {
        this._setService.cleanAll();
        setsRO.sets.forEach((set: SetEntity) => {
          const newSet: SetEntity = this._setFactory.createSet(set);
          this._setService.getSets().value.push(newSet);
        });
        this._setService.refresh();
      },
      (error) => {
        throw new Error(error);
      }
    );
  }

  // ==================================================
  //  Init Units Generics
  // ==================================================
  private initUnitsGenerics(): void {
    this.findUnitsGenerics();
    this.subscribeToUnitsGenerics();
  }

  private findUnitsGenerics(): void {
    this._unitGenericService.findAll().subscribe(
      (unitGenericRO) => {
        this._unitGenericService.cleanAll();
        unitGenericRO.unitsGenerics.forEach(
          (unitGeneric: UnitGenericEntity) => {
            const newUnitGeneric: UnitGenericEntity = this._unitGenericFactory.createUnitGeneric(
              unitGeneric
            );
            newUnitGeneric.marker.getElement().onclick = () =>
              this._matDialog.open(DialogUnitGenericComponent, {
                data: newUnitGeneric,
              });
            this._unitGenericService
              .getUnitsGeneric()
              .value.push(newUnitGeneric);
          }
        );
        this._unitGenericService.refresh();
      },
      (error) => {
        throw new Error(error);
      }
    );
  }

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
  //  Init Units Hydrants
  // ==================================================
  private initUnitsHydrants(): void {
    this.findUnitsHydrants();
    this.subscribeToUnitsHydrants();
    this.subscribeToUnitsHydrantsMarkerChange();
  }

  private findUnitsHydrants(): void {
    this._unitHydrantService.findAll().subscribe(
      (unitHydrantsRO) => {
        this._unitHydrantService.cleanAll();
        unitHydrantsRO.unitsHydrants.forEach(
          (unitHydrant: UnitHydrantEntity) => {
            const newUnitHydrant: UnitHydrantEntity = this._unitHydrantFactory.createUnitHydrant(
              unitHydrant
            );
            newUnitHydrant.marker.getElement().onclick = () =>
              this._matDialog.open(DialogUnitHydrantComponent, {
                data: newUnitHydrant,
              });
            this._unitHydrantService
              .getUnitsHydrants()
              .value.push(newUnitHydrant);
          }
        );
        this._unitHydrantService.refresh();
      },
      (error) => {
        throw new Error(error);
      }
    );
  }

  private subscribeToUnitsHydrants(): void {
    this._subUnitHydrants = this._unitHydrantService
      .getUnitsHydrants()
      .subscribe((unitsHydrants) => {
        unitsHydrants.forEach((unitHydrant) => {
          unitHydrant.marker.getElement().onclick = () =>
            this._matDialog.open(DialogUnitHydrantComponent, {
              data: unitHydrant,
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
            });
          };
        }
      });
  }

  // ==================================================
  //  Init Units Ponds
  // ==================================================
  private initUnitsPonds(): void {
    this.findUnitsPonds();
    this.subscribeToUnitsPonds();
  }

  private findUnitsPonds(): void {
    this._unitPondService.findAll().subscribe(
      (unitPondsRO) => {
        this._unitPondService.cleanAll();
        unitPondsRO.unitsPonds.forEach((unitPond: UnitPondEntity) => {
          const newUnitPond: UnitPondEntity = this._unitPondFactory.createUnitPond(
            unitPond
          );
          newUnitPond.marker.getElement().onclick = () =>
            this._matDialog.open(DialogUnitPondComponent, {
              data: newUnitPond,
            });
          this._unitPondService.getUnitsPonds().value.push(newUnitPond);
        });
        this._unitPondService.refresh();
      },
      (error) => {
        throw new Error(error);
      }
    );
  }

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
  }
}
