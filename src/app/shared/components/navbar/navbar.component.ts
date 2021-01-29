import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserSocketService } from 'src/app/modules/auth/user/user-socket.service';
import { UserEntity } from 'src/app/modules/auth/user/user.entity';
import { UnitStationPechinaService } from 'src/app/modules/unit/unit-station-pechina/unit-station-pechina.service';
import { AuthService } from '../../../modules/auth/auth/auth.service';
import { UserRole } from '../../../modules/auth/user/enum/user-role.enum';
import { DialogUnitGenericCreateComponent } from '../../../modules/unit/unit-generic/components/dialog-unit-generic-create/dialog-unit-generic-create.component';
import { UnitGenericService } from '../../../modules/unit/unit-generic/unit-generic.service';
import { DialogUnitHydrantCreateComponent } from '../../../modules/unit/unit-hydrant/components/dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';
import { UnitHydrantService } from '../../../modules/unit/unit-hydrant/unit-hydrant.service';
import { DialogUnitPondCreateComponent } from '../../../modules/unit/unit-pond/components/dialog-unit-pond-create/dialog-unit-pond-create.component';
import { UnitPondService } from '../../../modules/unit/unit-pond/unit-pond.service';
import { DialogSectorCreateComponent } from '../../../modules/wrap/sector/components/dialog-sector-create/dialog-sector-create.component';
import { DialogSetCreateComponent } from '../../../modules/wrap/set/components/dialog-set-create/dialog-set-create.component';
import { MapboxStyleEnum } from '../../../shared/constants/mapbox-style.enum';
import { GLOBAL } from '../../constants/global.constant';
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
  userRoles = UserRole;
  mapboxStyleEnum = MapboxStyleEnum;
  mapboxStyleSelected: MapboxStyleEnum;
  consDialogInfo = GLOBAL;
  hidden = true;
  user: UserEntity;
  sessionCardHidden = true;
  usersSockets: Set<string> = new Set();

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
    private readonly _unitStationPechinaService: UnitStationPechinaService,
    private readonly _mapService: MapService,
    private readonly _startService: StartService,
    private readonly _userSocketService: UserSocketService
  ) {}

  // ==================================================
  //  LIFE CYCLE
  // ==================================================
  ngOnInit(): void {
    this._authService.getUser$().subscribe((user) => {
      if (user) {
        if (user.role !== UserRole.NONE) {
          this.hidden = false;
        } else {
          this.hidden = true;
        }
      } else {
        this.hidden = true;
      }
    });
    this._authService.getUser$().subscribe((user) => {
      this.user = user;
    });
    this._userSocketService.getUsers$().subscribe((users) => {
      this.usersSockets.clear();
      users.forEach((user) => {
        this.usersSockets.add(user);
      });
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

  showAll(): void {
    this.showUnitsHydrants();
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

  openPageUsers(): void {
    this._router.navigate(['/users']);
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

  flyToUnitStationPechina(): void {
    const longitude = this._unitStationPechinaService.getUnitStationPechina()
      .value.unit.longitude;
    const latitude = this._unitStationPechinaService.getUnitStationPechina()
      .value.unit.latitude;
    this._mapService.centerTo(longitude, latitude);
  }

  flyToUnitStationPlanta(): void {
    const longitude = -2.416275;
    const latitude = 36.874496;
    this._mapService.centerTo(longitude, latitude);
  }

  flyToUnitStationGador(): void {
    const longitude = -2.508389;
    const latitude = 36.963916;
    this._mapService.centerTo(longitude, latitude);
  }

  flyToUnitStationBoticario(): void {
    const longitude = -2.390605;
    const latitude = 36.867357;
    this._mapService.centerTo(longitude, latitude);
  }

  flyToUnitStationLasViudas(): void {
    const longitude = -2.378156;
    const latitude = 36.889178;
    this._mapService.centerTo(longitude, latitude);
  }

  flyToUnitStationLosTrancos(): void {
    const longitude = -2.280015;
    const latitude = 36.850658;
    this._mapService.centerTo(longitude, latitude);
  }

  flyToUnitStationAljibeSalvador(): void {
    const longitude = -2.363679;
    const latitude = 36.876024;
    this._mapService.centerTo(longitude, latitude);
  }

  flyToUnitStationCostacabana(): void {
    const longitude = -2.387583;
    const latitude = 36.837485;
    this._mapService.centerTo(longitude, latitude);
  }

  flyToUnitStationBobar(): void {
    const longitude = -2.424824;
    const latitude = 36.82205;
    this._mapService.centerTo(longitude, latitude);
  }

  // ==================================================
  //  LOGOUT & CLOSE
  // ==================================================
  logout(): void {
    this._authService.logout();
    this.sessionCardHidden = true;
  }

  close(reason: string): void {
    this.reason = reason;
    this.sidenav.close();
  }
}
