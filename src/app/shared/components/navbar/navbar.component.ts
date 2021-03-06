import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
import { UserRoleEnum } from '../../constants/user-role.enum';
import { AuthService } from '../../services/auth.service';
import { MapService } from '../../services/map.service';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { DialogSettingComponent } from './../../../modules/general/setting/components/dialog-setting/dialog-setting.component';
import { DialogOrderCreateComponent } from './../../../modules/session/order/components/dialog-order-create/dialog-order-create.component';
import { StartService } from './../../services/start.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  stations: Array<StationEntity>;
  userRole: UserRoleEnum = null;
  mapboxStyleEnum = MapboxStyleEnum;
  mapboxStyleSelected: MapboxStyleEnum;
  consDialogInfo = GLOBAL;
  disabled = false;
  hidden = true;

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
  //  VARS SUBSCRIPTIONS
  // ==================================================
  private _subStations: Subscription;
  private _subUnitGenerics: Subscription;
  private _subUnitHydrants: Subscription;
  private _subUnitPonds: Subscription;

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _matDialog: MatDialog,
    private readonly _unitGenericService: UnitGenericService,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitPondService: UnitPondService,
    private readonly _stationService: StationService,
    private readonly _mapService: MapService,
    private readonly _startService: StartService
  ) {
    this._stationService.getStations().subscribe((stations) => {
      if (stations) {
        this.stations = stations;
      }
    });
  }

  // ==================================================
  //  LIFE CYCLE
  // ==================================================
  ngOnInit(): void {
    this._authService.getSubjectUserRole().subscribe((res) => {
      if (res) {
        this.hidden = false;
      } else {
        this.hidden = true;
      }
    });
    this._authService.getSubjectAdminOrModerator().subscribe((res) => {
      if (res) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    });
  }

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
  }

  // ==================================================
  //  MAP
  // ==================================================
  centerMapTo(station: StationEntity): void {
    this._mapService.centerTo(station.longitude, station.latitude);
  }

  // ==================================================
  //  SHOW MARKER ON MAP
  // ==================================================
  showUnitsHydrants(): void {
    if (this.cbxUnitHydrantChecked) {
      this._unitHydrantService.getHiddenMarker().next(false);
    } else {
      this._unitHydrantService.getHiddenMarker().next(true);
    }
  }

  showUnitsPonds(): void {
    if (this.cbxUnitPondChecked) {
      this._unitPondService.getHiddenMarker().next(false);
    } else {
      this._unitPondService.getHiddenMarker().next(true);
    }
  }

  showUnitsGenerics(): void {
    if (this.cbxUnitGenericChecked) {
      this._unitGenericService.getHiddenMarker().next(false);
    } else {
      this._unitGenericService.getHiddenMarker().next(true);
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

  // ==================================================
  //  GO TO ENTITIES PAGES
  // ==================================================
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
  //  OPEN DIALOGS
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
  //  LOGOUT & CLOSE
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
