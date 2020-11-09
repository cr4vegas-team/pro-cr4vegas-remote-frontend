import { UnitPondFactory } from './../../../modules/unit/unit-pond/unit-pond.factory';
import { UnitGenericFactory } from './../../../modules/unit/unit-generic/unit-generic.factory';
import { UnitHydrantFactory } from './../../../modules/unit/unit-hydrant/unit-hydrant.factory';
import { SetFactory } from './../../../modules/wrap/set/set.factory';
import { SectorFactory } from './../../../modules/wrap/sector/sector.factory';
import { StationFactory } from './../../../modules/wrap/station/station.factory';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { DialogUnitGenericCreateComponent } from '../../../modules/unit/unit-generic/components/dialog-unit-generic-create/dialog-unit-generic-create.component';
import { DialogUnitGenericComponent } from '../../../modules/unit/unit-generic/components/dialog-unit-generic/dialog-unit-generic.component';
import { UnitGenericService } from '../../../modules/unit/unit-generic/unit-generic.service';
import { DialogUnitHydrantCreateComponent } from '../../../modules/unit/unit-hydrant/components/dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';
import { DialogUnitHydrantComponent } from '../../../modules/unit/unit-hydrant/components/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { UnitHydrantService } from '../../../modules/unit/unit-hydrant/unit-hydrant.service';
import { DialogUnitPondCreateComponent } from '../../../modules/unit/unit-pond/components/dialog-unit-pond-create/dialog-unit-pond-create.component';
import { DialogUnitPondComponent } from '../../../modules/unit/unit-pond/components/dialog-unit-pond/dialog-unit-pond.component';
import { UnitPondService } from '../../../modules/unit/unit-pond/unit-pond.service';
import { DialogSectorCreateComponent } from '../../../modules/wrap/sector/components/dialog-sector-create/dialog-sector-create.component';
import { SectorService } from '../../../modules/wrap/sector/sector.service';
import { DialogSetCreateComponent } from '../../../modules/wrap/set/components/dialog-set-create/dialog-set-create.component';
import { SetService } from '../../../modules/wrap/set/set.service';
import { DialogStationCreateComponent } from '../../../modules/wrap/station/components/dialog-station-create/dialog-station-create.component';
import { DialogStationComponent } from '../../../modules/wrap/station/components/dialog-station/dialog-station.component';
import { StationEntity } from '../../../modules/wrap/station/station.entity';
import { StationService } from '../../../modules/wrap/station/station.service';
import { MapboxStyleEnum } from '../../../shared/constants/mapbox-style.enum';
import { GLOBAL } from '../../constants/global.constant';
import { AuthService } from '../../services/auth.service';
import { MapService } from '../../services/map.service';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { DialogSettingComponent } from './../../../modules/general/setting/components/dialog-setting/dialog-setting.component';
import { DialogOrderCreateComponent } from './../../../modules/session/order/components/dialog-order-create/dialog-order-create.component';
import { UnitGenericEntity } from './../../../modules/unit/unit-generic/unit-generic.entity';
import { UnitHydrantEntity } from './../../../modules/unit/unit-hydrant/unit-hydrant.entity';
import { UnitPondEntity } from './../../../modules/unit/unit-pond/unit-pond.entity';
import { SectorEntity } from './../../../modules/wrap/sector/sector.entity';
import { SetEntity } from './../../../modules/wrap/set/set.entity';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  stations: Array<StationEntity>;
  isAuthenticated = false;
  mapboxStyleEnum = MapboxStyleEnum;
  mapboxStyleSelected: MapboxStyleEnum;
  consDialogInfo = GLOBAL;

  // ==================================================
  //  SHOWING CHECKBOX
  // ==================================================
  cbxStationChecked = true;
  cbxUnitHydrantChecked = true;
  cbxUnitPondChecked = true;
  cbxUnitGenericChecked = true;

  @ViewChild('sidenav') sidenav: MatSidenav;

  reason = '';

  // ==================================================

  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _matDialog: MatDialog,
    private readonly _unitGenericService: UnitGenericService,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitPondService: UnitPondService,
    private readonly _stationService: StationService,
    private readonly _sectorService: SectorService,
    private readonly _unitHydrantFactory: UnitHydrantFactory,
    private readonly _unitGenericFactory: UnitGenericFactory,
    private readonly _unitPondFactory: UnitPondFactory,
    private readonly _stationFactory: StationFactory,
    private readonly _sectorFactory: SectorFactory,
    private readonly _setFactory: SetFactory,
    private readonly _setService: SetService,
    private readonly _mapService: MapService
  ) {
    this.findStations();
    this.findSectors();
    this.findSets();
    this.findUnitsGenerics();
    this.findUnitsHydrants();
    this.findUnitsPonds();
  }

  // ==================================================
  //  SUBSCRIPTIONS
  // ==================================================
  private findStations(): void {
    this._stationService.findAll().subscribe(
      (stationsRO) => {
        this.stations = stationsRO.stations;
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

  // ==================================================

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
      },
      (error) => {
        throw new Error(error);
      }
    );
  }

  // ==================================================

  private findSets(): void {
    this._setService.findAll().subscribe(
      (setsRO) => {
        this._setService.cleanAll();
        setsRO.sets.forEach((set: SetEntity) => {
          const newSet: SetEntity = this._setFactory.createSet(set);
          this._setService.getSets().value.push(newSet);
        });
      },
      (error) => {
        throw new Error(error);
      }
    );
  }

  // ==================================================

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
            this._unitGenericService.addOne(newUnitGeneric);
          }
        );
      },
      (error) => {
        throw new Error(error);
      }
    );
  }

  // ==================================================

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
            this._unitHydrantService.addOne(newUnitHydrant);
          }
        );
      },
      (error) => {
        throw new Error(error);
      }
    );
  }

  // ==================================================

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
          this._unitPondService.addOne(newUnitPond);
        });
      },
      (error) => {
        throw new Error(error);
      }
    );
  }

  // ==================================================

  // ==================================================
  //  LIFE CYCLE
  // ==================================================
  ngOnInit(): void {
    this._authService.isAuthenticated().subscribe((res) => {
      this.isAuthenticated = res;
    });
  }

  centerMapTo(station: StationEntity): void {
    this._mapService.centerTo(station.longitude, station.latitude);
  }

  // ==================================================
  //  CONTROL UNITS SHOW
  // ==================================================

  showUnitsHydrants(): void {
    if (this.cbxUnitHydrantChecked) {
      this._unitHydrantService.hiddenMarker.next(false);
    } else {
      this._unitHydrantService.hiddenMarker.next(true);
    }
  }

  showUnitsPonds(): void {
    if (this.cbxUnitPondChecked) {
      this._unitPondService.hiddenMarker.next(false);
    } else {
      this._unitPondService.hiddenMarker.next(true);
    }
  }

  showUnitsGenerics(): void {
    if (this.cbxUnitGenericChecked) {
      this._unitGenericService.hiddenMarker.next(false);
    } else {
      this._unitGenericService.hiddenMarker.next(true);
    }
  }

  showStations(): void {
    if (this.cbxStationChecked) {
      this._stationService.getHiddenMarkers().next(false);
    } else {
      this._stationService.getHiddenMarkers().next(true);
    }
  }

  showAll(): void {
    this.showUnitsHydrants();
    this.showStations();
    this.showUnitsPonds();
    this.showUnitsGenerics();
  }

  setCbxToTrue(): void {
    this.cbxUnitHydrantChecked = true;
    this.cbxStationChecked = true;
    this.cbxUnitPondChecked = true;
    this.cbxUnitGenericChecked = true;
    this.showAll();
  }

  setCbxToFalse(): void {
    this.cbxUnitHydrantChecked = false;
    this.cbxStationChecked = false;
    this.cbxUnitPondChecked = false;
    this.cbxUnitGenericChecked = false;
    this.showAll();
  }

  // ==================================================
  //  CHANGE STYLE MAP
  // ==================================================
  setStyle(event: MatRadioChange): void {
    this._mapService.setStyle(event.value);
  }

  goMap(): void {
    this._router.navigate(['/map']);
  }

  goStations(): void {
    this._router.navigate(['/stations']);
  }

  goSectors(): void {
    this._router.navigate(['/sectors']);
  }

  goSets(): void {
    this._router.navigate(['/sets']);
  }

  goUnitsGenerics(): void {
    this._router.navigate(['/units-generics']);
  }

  goUnitsHydrants(): void {
    this._router.navigate(['/units-hydrants']);
  }

  goUnitsPonds(): void {
    this._router.navigate(['/units-ponds']);
  }

  openPageSession(): void {
    this._router.navigate(['/sessions']);
  }

  openPageRegistry(): void {
    this._router.navigate(['/registries']);
  }

  openPageAction(): void {
    this._router.navigate(['/actions']);
  }

  openPageAlarm(): void {
    this._router.navigate(['/alarms']);
  }

  openPageOrder(): void {
    this._router.navigate(['/orders']);
  }
  // ==================================================
  //  DIALOGS
  // ==================================================
  openDialogInfo(data: string): void {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  openDialogStationCreate(): void {
    this._matDialog.open(DialogStationCreateComponent, { data: null });
  }

  openDialogSectorCreate(): void {
    this._matDialog.open(DialogSectorCreateComponent, { data: null });
  }

  openDialogSetCreate(): void {
    this._matDialog.open(DialogSetCreateComponent, { data: null });
  }

  openDialogUnitGenericCreate(): void {
    this._matDialog.open(DialogUnitGenericCreateComponent, { data: null });
  }

  openDialogUnitHydrantCreate(): void {
    this._matDialog.open(DialogUnitHydrantCreateComponent, { data: null });
  }

  openDialogUnitPondCreate(): void {
    this._matDialog.open(DialogUnitPondCreateComponent, { data: null });
  }

  openDialogOrderCreate(): void {
    this._matDialog.open(DialogOrderCreateComponent, { data: null });
  }

  openDialogSetting(): void {
    this._matDialog.open(DialogSettingComponent, { data: null });
  }

  // ==================================================
  //  LOGOUT
  // ==================================================
  logout(): void {
    this._authService.logout();
    this._router.navigateByUrl('/');
  }

  close(reason: string): void {
    this.reason = reason;
    this.sidenav.close();
  }
}
