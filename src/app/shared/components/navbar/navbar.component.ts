import { UnitPondEntity } from './../../../modules/unit/unit-pond/unit-pond.entity';
import { UnitHydrantEntity } from './../../../modules/unit/unit-hydrant/unit-hydrant.entity';
import { UnitGenericEntity } from './../../../modules/unit/unit-generic/unit-generic.entity';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { DialogUnitGenericComponent } from 'src/app/modules/unit/unit-generic/components/dialog-unit-generic/dialog-unit-generic.component';
import { DialogUnitHydrantComponent } from 'src/app/modules/unit/unit-hydrant/components/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { DialogUnitPondComponent } from 'src/app/modules/unit/unit-pond/components/dialog-unit-pond/dialog-unit-pond.component';
import { SectorService } from 'src/app/modules/wrap/sector/sector.service';
import { SetService } from 'src/app/modules/wrap/set/set.service';
import { DialogStationComponent } from 'src/app/modules/wrap/station/components/dialog-station/dialog-station.component';
import { DialogUnitGenericCreateComponent } from '../../../modules/unit/unit-generic/components/dialog-unit-generic-create/dialog-unit-generic-create.component';
import { UnitGenericService } from '../../../modules/unit/unit-generic/unit-generic.service';
import { DialogUnitHydrantCreateComponent } from '../../../modules/unit/unit-hydrant/components/dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';
import { UnitHydrantService } from '../../../modules/unit/unit-hydrant/unit-hydrant.service';
import { DialogUnitPondCreateComponent } from '../../../modules/unit/unit-pond/components/dialog-unit-pond-create/dialog-unit-pond-create.component';
import { UnitPondService } from '../../../modules/unit/unit-pond/unit-pond.service';
import { DialogSectorCreateComponent } from '../../../modules/wrap/sector/components/dialog-sector-create/dialog-sector-create.component';
import { DialogSetCreateComponent } from '../../../modules/wrap/set/components/dialog-set-create/dialog-set-create.component';
import { DialogStationCreateComponent } from '../../../modules/wrap/station/components/dialog-station-create/dialog-station-create.component';
import { StationEntity } from '../../../modules/wrap/station/station.entity';
import { StationService } from '../../../modules/wrap/station/station.service';
import { MapboxStyleEnum } from '../../../shared/constants/mapbox-style.enum';
import { GLOBAL } from '../../constants/global.constant';
import { AuthService } from '../../services/auth.service';
import { MapService } from '../../services/map.service';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { DialogSettingComponent } from './../../../modules/general/setting/components/dialog-setting/dialog-setting.component';
import { DialogOrderCreateComponent } from './../../../modules/session/order/components/dialog-order-create/dialog-order-create.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
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
  //  SUBSCRIPTIONS
  // ==================================================
  private _subStations: Subscription;
  private _unitsGenerics: Subscription;
  private _unitsPonds: Subscription;
  private _unitsHydrants: Subscription;

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
    private readonly _setService: SetService,
    private readonly _mapService: MapService
  ) {
    this.subscribeToStations();
    this.subscribeToUnitsGenerics();
    this.subscribeToUnitsHydrants();
    this.subscribeToUnitsPonds();
  }

  // ==================================================
  //  SUBSCRIPTIONS
  // ==================================================
  private subscribeToStations(): void {
    this._subStations = this._stationService.findAll().subscribe(
      (stationsRO) => {
        this.stations = stationsRO.stations;
        this._stationService.cleanAll();
        stationsRO.stations.forEach((station: StationEntity) => {
          const newStation: StationEntity = this._stationService
            .getFactory()
            .createStation(station);
          newStation.marker.getElement().onclick = () =>
            this._matDialog.open(DialogStationComponent, { data: newStation });
          this._stationService.stations.value.push(newStation);
        });
      },
      (error) => {
        throw new Error(error);
      }
    );
  }

  // ==================================================

  private subscribeToUnitsGenerics(): void {
    this._unitsGenerics = this._unitGenericService.findAll().subscribe(
      (unitGenericRO) => {
        this._unitGenericService.cleanAll();
        unitGenericRO.unitsGenerics.forEach(
          (unitGeneric: UnitGenericEntity) => {
            const newUnitGeneric: UnitGenericEntity = this._unitGenericService.factory.createUnitGeneric(
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

  private subscribeToUnitsHydrants(): void {
    this._unitsHydrants = this._unitHydrantService.findAll().subscribe(
      (unitHydrantsRO) => {
        this._unitHydrantService.cleanAll();
        unitHydrantsRO.unitsHydrants.forEach(
          (unitHydrant: UnitHydrantEntity) => {
            const newUnitHydrant: UnitHydrantEntity = this._unitHydrantService.factory.createUnitHydrant(
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

  private subscribeToUnitsPonds(): void {
    this._unitsPonds = this._unitPondService.findAll().subscribe(
      (unitPondsRO) => {
        this._unitPondService.cleanAll();
        unitPondsRO.unitsPonds.forEach((unitPond: UnitPondEntity) => {
          const newUnitPond: UnitPondEntity = this._unitPondService.factory.createUnitPond(
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

  ngOnDestroy(): void {
    if (this._subStations) {
      this._subStations.unsubscribe();
    }
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
      this._stationService.hiddenMarkers().next(false);
    } else {
      this._stationService.hiddenMarkers().next(true);
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
