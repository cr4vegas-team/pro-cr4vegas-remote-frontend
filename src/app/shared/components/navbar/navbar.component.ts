import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { UnitPondService } from '../../../modules/unit/unit-pond/unit-pond.service';
import { MapService } from '../../services/map.service';
import { MapboxStyleEnum } from '../../../shared/constants/mapbox-style.enum';
import { StationEntity } from '../../../modules/wrap/station/station.entity';
import { AuthService } from '../../services/auth.service';
import { StationService } from '../../../modules/wrap/station/station.service';
import { UnitHydrantService } from '../../../modules/unit/unit-hydrant/unit-hydrant.service';
import { GLOBAL } from '../../constants/global.constant';
import { DialogUnitGenericCreateComponent } from '../../../modules/unit/unit-generic/components/dialog-unit-generic-create/dialog-unit-generic-create.component';
import { DialogUnitPondCreateComponent } from '../../../modules/unit/unit-pond/components/dialog-unit-pond-create/dialog-unit-pond-create.component';
import { DialogSectorCreateComponent } from '../../../modules/wrap/sector/components/dialog-sector-create/dialog-sector-create.component';
import { DialogSetCreateComponent } from '../../../modules/wrap/set/components/dialog-set-create/dialog-set-create.component';
import { DialogStationCreateComponent } from '../../../modules/wrap/station/components/dialog-station-create/dialog-station-create.component';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { DialogUnitHydrantCreateComponent } from 'src/app/modules/unit/unit-hydrant/components/dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';
import { UnitGenericService } from 'src/app/modules/unit/unit-generic/unit-generic.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  stations: Array<StationEntity>;
  isAuthenticated: Boolean = false;
  mapboxStyleEnum = MapboxStyleEnum;
  mapboxStyleSelected: MapboxStyleEnum;
  consDialogInfo = GLOBAL;

  cbxStationChecked: boolean = true;
  cbxUnitHydrantChecked: boolean = true;
  cbxUnitPondChecked: boolean = true;
  cbxUnitGenericChecked: boolean = true;

  constructor(
    private readonly _stationService: StationService,
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _matDialog: MatDialog,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitPondService: UnitPondService,
    private readonly _unitGenericService: UnitGenericService,
    private readonly _mapService: MapService,
  ) { }

  ngOnInit(): void {
    this._stationService.stations.subscribe(
      res => {
        this.stations = res;
      },
      err => {
        console.log(err);
      }
    );
    this._authService.isAuthenticated().subscribe(
      res => {
        this.isAuthenticated = res;
      }
    );
  }

  centerMapTo(station: StationEntity) {
    this._mapService.centerTo(station.longitude, station.latitude);
  }

  setStyle(event: MatRadioChange) {
    this._mapService.setStyle(event.value);
  }

  logout() {
    this._authService.logout();
    this._router.navigateByUrl('/');
  }

  @ViewChild('sidenav') sidenav: MatSidenav;

  reason = '';

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  goMap() {
    this._router.navigate(['/map'])
  }

  goStations() {
    this._router.navigate(['/stations']);
  }

  goSectors() {
    this._router.navigate(['/sectors']);
  }

  goSets() {
    this._router.navigate(['/sets']);
  }

  goUnitsGenerics() {
    this._router.navigate(['/units-generics']);
  }

  goUnitsHydrants() {
    this._router.navigate(['/units-hydrants']);
  }

  goUnitsPonds() {
    this._router.navigate(['/units-ponds']);
  }

  showUnitsHydrants() {
    if (this.cbxUnitHydrantChecked) {
      this._unitHydrantService.addMarkersAndSubscribeMQTTAll();
    } else {
      this._unitHydrantService.removeMarkersAndUnsubscribeMQTTAll();
    }
  }

  showUnitsPonds() {
    if (this.cbxUnitPondChecked) {
      this._unitPondService.addMarkersAndSubscribeMQTTAll();
    } else {
      this._unitPondService.removeMarkersAndUnsubscribeMQTTAll();
    }
  }

  showUnitsGenerics() {
    if (this.cbxUnitGenericChecked) {
      this._unitGenericService.addMarkersAndSubscribeMQTTAll();
    } else {
      this._unitGenericService.removeMarkersAndUnsubscribeMQTTAll();
    }
  }

  showStations() {
    if (this.cbxStationChecked) {
      this._stationService.addMarkersAll();
    } else {
      this._stationService.removeMarkersAll();
    }
  }

  showAll() {
    this.showUnitsHydrants();
    this.showStations();
    this.showUnitsPonds();
    this.showUnitsGenerics();
  }

  setCbxToTrue() {
    this.cbxUnitHydrantChecked = true;
    this.cbxStationChecked = true;
    this.cbxUnitPondChecked = true;
    this.cbxUnitGenericChecked = true;
    this.showAll();
  }

  setCbxToFalse() {
    this.cbxUnitHydrantChecked = false;
    this.cbxStationChecked = false;
    this.cbxUnitPondChecked = false;
    this.cbxUnitGenericChecked = false;
    this.showAll();
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  openDialogStationCreate() {
    this._matDialog.open(DialogStationCreateComponent, { data: null })
  }

  openDialogSectorCreate() {
    this._matDialog.open(DialogSectorCreateComponent, { data: null })
  }

  openDialogSetCreate() {
    this._matDialog.open(DialogSetCreateComponent, { data: null })
  }

  openDialogUnitGenericCreate() {
    this._matDialog.open(DialogUnitGenericCreateComponent, { data: null })
  }

  openDialogUnitHydrantCreate() {
    this._matDialog.open(DialogUnitHydrantCreateComponent, { data: null })
  }

  openDialogUnitPondCreate() {
    this._matDialog.open(DialogUnitPondCreateComponent, { data: null })
  }
}
