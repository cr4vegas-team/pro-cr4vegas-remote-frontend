import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { UnitPondService } from '../../../../app/services/api/unit-pond.service';
import { MapService } from '../../../../app/services/map.service';
import { MapboxStyleEnum } from '../../../constants/mapbox-style.enum';
import { StationEntity } from '../../../models/station.entity';
import { AuthService } from '../../../services/api/auth.service';
import { StationService } from '../../../services/api/station.service';
import { UnitHydrantService } from '../../../services/api/unit-hydrant.service';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { CONS_DIALOG_INFO } from '../dialog-info/dialog-info.constants';
import { DialogUnitHydrantCreateComponent } from '../dialog-unit-hydrant-create/dialog-unit-hydrant-create.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  stations: Array<StationEntity>;
  isAuthenticated: boolean = false;
  mapboxStyleEnum = MapboxStyleEnum;
  mapboxStyleSelected: MapboxStyleEnum;
  consDialogInfo = CONS_DIALOG_INFO;
  cbxHydrantChecked: boolean = true;
  cbxStationChecked: boolean = true;

  constructor(
    private readonly _stationService: StationService,
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _matDialog: MatDialog,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitPondService: UnitPondService,
    private readonly _mapService: MapService,
  ) { 
  }

  ngOnInit(): void {
    this._stationService.subscribeToStatiosn().subscribe(
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
      },
      err => {
        console.log(err.message);
        this.isAuthenticated = false;
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

  shouldRun = true;

  goHydrants() {
    this._router.navigate(['/hydrants']);
  }

  goMap() {
    this._router.navigate(['/map'])
  }

  showHydrants() {
    if (this.cbxHydrantChecked) {
      this._unitHydrantService.addMarkersAndSubscribeMQTTAll();
    } else {
      this._unitHydrantService.removeMarkersAndUnsubscribeMQTTAll();
    }
  }

  showStations() {
    // TODO showStations()...
  }

  showAll() {
    this.showHydrants();
    this.showStations();
  }

  setCbxToTrue() {
    this.cbxHydrantChecked = true;
    this.cbxStationChecked = true;
    this.showAll();
  }

  setCbxToFalse() {
    this.cbxHydrantChecked = false;
    this.cbxStationChecked = false;
    this.showAll();
  }

  openDialogInfo(data: string) {
    this._matDialog.open(DialogInfoComponent, { data });
  }

  openDialogHydrantCreate() {
    this._matDialog.open(DialogUnitHydrantCreateComponent, { data: null })
  }
}
