import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UnitFactory } from 'src/app/factories/unit.factory';
import { UnitEntity } from 'src/app/models/unit.entity';
import { GLOBAL } from '../../constants/global.constant';
import { UnitHydrantEntity } from '../../models/unit-hydrant.entity';
import { MapService } from '../map.service';
import { AuthService } from './auth.service';
import { Map } from 'mapbox-gl';

@Injectable({
  providedIn: 'root',
})
export class UnitHydrantService {

  private _url: string = GLOBAL.API + 'unit-hydrant';

  private _unitsHydrants: BehaviorSubject<UnitHydrantEntity[]>;
  private _map: Map;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _unitFactory: UnitFactory,
    private readonly _mapService: MapService,
  ) {
    this._unitsHydrants = new BehaviorSubject<UnitHydrantEntity[]>(Array<UnitHydrantEntity>());
    this._mapService.getMap().subscribe(
      (map: Map) => {
        if (map) {
          this._map = map;
          this.setMapToHydrants();
        }
      }
    );
    this._authService.isAuthenticated().subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this.getHydrants();
        }
      }
    );
  }

  subscribeToHydrants(): BehaviorSubject<UnitHydrantEntity[]> {
    return this._unitsHydrants;
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

  private getHydrants() {
    this._httpClient.get(this._url, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        this._unitsHydrants.value.forEach(unitHydrant => {
          unitHydrant.getMarker().remove();
          unitHydrant.getSubscription().unsubscribe();
        });
        this._unitsHydrants.value.splice(0);
        (res as any).unitsHydrants.forEach((unitHydrant: UnitHydrantEntity) => {
          let newUnitHydrant: UnitHydrantEntity = this.createUnitHydrantWithResponseValues(unitHydrant);
          this._unitsHydrants.value.push(newUnitHydrant);
        });
        this._unitsHydrants.next(this._unitsHydrants.value);
        this.setMapToHydrants();
      },
      err => {
        this._unitsHydrants.error(err);
      }
    );
  }

  addHydrant(unitHydrant: UnitHydrantEntity) {
    this._httpClient.post(this._url, unitHydrant, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        const newUnitHydrant: UnitHydrantEntity = this.createUnitHydrantWithResponseValues(res);
        this._unitsHydrants.value.push(newUnitHydrant);
        this._unitsHydrants.next(this._unitsHydrants.value);
      },
      err => {
        this._unitsHydrants.error(err);
      }
    )
  }

  removeHydrant(unitHydrant: UnitHydrantEntity) {
    this._httpClient.delete(this._url + `/${unitHydrant.getUnit().getCode()}`, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        if (res) {
          unitHydrant.getMarker().remove();
          unitHydrant.getSubscription().unsubscribe();
          unitHydrant.getUnit().setActive(0);
          this._unitsHydrants.next(this._unitsHydrants.value);
        }
      },
      err => {
        this._unitsHydrants.error(err);
      }
    )
  }

  activeHydrant(unitHydrant: UnitHydrantEntity) {
    this._httpClient.patch(this._url + `/${unitHydrant.getId()}`, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        if (res) {
          unitHydrant.setMarker();
          unitHydrant.setSubscription();
          unitHydrant.getUnit().setActive(1);
          this._unitsHydrants.next(this._unitsHydrants.value);
        }
      },
      err => {
        this._unitsHydrants.error(err);
      }
    )
  }

  modifyHydrant(unitHydrant: UnitHydrantEntity, updateHydrant: any) {
    console.log(updateHydrant);
    this._httpClient.put(this._url + `/${unitHydrant.getId()}`, updateHydrant, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        if (res) {
          if (res as any) {
            this.copyValuesUnitHydrant(unitHydrant, updateHydrant);
            unitHydrant.setMarker();
            unitHydrant.setSubscription();
            this._unitsHydrants.next(this._unitsHydrants.value);
          }
        }
      },
      err => {
        console.log('ERROR: ' + err.message);
        this._unitsHydrants.error(err);
      }
    )
  }

  // ==================================================
  // Marker & MQTT
  // ==================================================

  addMarkersAndSubscribeMQTTAll() {
    this._unitsHydrants.value.forEach(hydrant => {
      hydrant.setMarker();
      hydrant.setSubscription();
    });
    this._unitsHydrants.next(this._unitsHydrants.value);
  }

  removeMarkersAndUnsubscribeMQTTAll() {
    this._unitsHydrants.value.forEach(hydrant => {
      hydrant.getMarker().remove();
      hydrant.getSubscription().unsubscribe();
    });
    this._unitsHydrants.next(this._unitsHydrants.value);
  }

  private setMapToHydrants() {
    if (this._map) {
      this._unitsHydrants.value.forEach(unitHydrant => {
        unitHydrant.setMap(this._map);
      });
    }
  }

  // ==================================================
  // UnitHydrant
  // ==================================================

  setValve(unitHydrant: UnitHydrantEntity, valve: boolean) {
    unitHydrant.setValve(valve);
    this._unitsHydrants.next(this._unitsHydrants.value);
  }

  private createUnitHydrantWithResponseValues(res: any): UnitHydrantEntity {
    let newUnitHydrant: UnitHydrantEntity = this._unitFactory.createUnitHydrant();
    let newUnit: UnitEntity = this._unitFactory.createUnit();
    newUnitHydrant.setUnit(newUnit);
    this.copyValuesUnitHydrant(newUnitHydrant, res);
    newUnitHydrant.setSubscription();
    newUnitHydrant.setMarker();
    return newUnitHydrant;
  }

  private copyValuesUnitHydrant(target: UnitHydrantEntity, source: any) {
    target.setId(source.id);
    target.setDiameter(source.diameter);
    target.setFilter(source.filter);
    target.getUnit().setId(source.unit.id);
    target.getUnit().setCode(source.unit.code);
    target.getUnit().setAltitude(source.unit.altitude);
    target.getUnit().setLongitude(source.unit.longitude);
    target.getUnit().setLatitude(source.unit.latitude);
    target.getUnit().setUnitType(source.unit.unitType);
    target.getUnit().setSector(source.unit.sector);
    target.getUnit().setStation(source.unit.station);
    target.getUnit().setSets(source.unit.sets);
    target.getUnit().setActive(source.unit.active);
    target.getUnit().setCreated(source.unit.created);
    target.getUnit().setUpdated(source.unit.updated);
    target.getUnit().setDescription(source.unit.description);
    target.checkStatus();
  }
}
