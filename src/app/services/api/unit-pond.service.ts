import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Map } from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { GLOBAL } from '../../../app/constants/global.constant';
import { UnitFactory } from '../../../app/factories/unit.factory';
import { UnitPondEntity } from '../../../app/models/unit-pond.entity';
import { UnitEntity } from '../../../app/models/unit.entity';
import { MapService } from '../map.service';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UnitPondService {


  private _url: string = GLOBAL.API + 'unit-pond';

  private _unitsPonds: BehaviorSubject<UnitPondEntity[]>;

  private _map: Map;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _unitFactory: UnitFactory,
    private readonly _mapService: MapService,
  ) {
    this._unitsPonds = new BehaviorSubject<UnitPondEntity[]>(Array<UnitPondEntity>());
    this._mapService.getMap().subscribe(
      (map: Map) => {
        if (map) {
          this._map = map;
          this.setMapToUnitsPonds();
        }
      }
    );
    this._authService.isAuthenticated().subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this.getPonds();
        }
      }
    );
  }

  subscribeToHydrants(): BehaviorSubject<UnitPondEntity[]> {
    return this._unitsPonds;
  }

  update() {
    this._unitsPonds.next(this._unitsPonds.value);
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

  private getPonds() {
    this._httpClient.get(this._url, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        this._unitsPonds.value.forEach(unitPond => {
          unitPond.getMarker().remove();
          unitPond.getSubscription().unsubscribe();
        });
        this._unitsPonds.value.splice(0);
        (res as any).unitsPonds.forEach((unitPond: UnitPondEntity) => {
          let newUnitPond: UnitPondEntity = this.createUnitPondWithResponseValues(unitPond);
          this._unitsPonds.value.push(newUnitPond);
        });
        this._unitsPonds.next(this._unitsPonds.value);
        this.setMapToUnitsPonds();
      },
      err => {
        this._unitsPonds.error(err);
      }
    );
  }

  addUnitPond(unitPond: UnitPondEntity) {
    this._httpClient.post(this._url, unitPond, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        const newUnitPond: UnitPondEntity = this.createUnitPondWithResponseValues(res);
        this._unitsPonds.value.push(newUnitPond);
        this._unitsPonds.next(this._unitsPonds.value);
      },
      err => {
        this._unitsPonds.error(err);
      }
    )
  }

  removeUnitPond(unitPond: UnitPondEntity) {
    this._httpClient.delete(this._url + `/${unitPond.getId()}`, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        if (res) {
          unitPond.getMarker().remove();
          unitPond.getSubscription().unsubscribe();
          unitPond.getUnit().setActive(0);
          this._unitsPonds.next(this._unitsPonds.value);
        }
      },
      err => {
        this._unitsPonds.error(err);
      }
    )
  }

  activeUnitPond(unitPond: UnitPondEntity) {
    this._httpClient.patch(this._url + `/${unitPond.getId()}`, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        if (res) {
          unitPond.setMarker();
          unitPond.setSubscription();
          unitPond.getUnit().setActive(1);
          this._unitsPonds.next(this._unitsPonds.value);
        }
      },
      err => {
        this._unitsPonds.error(err);
      }
    )
  }

  modifyUnitPond(unitPond: UnitPondEntity, updateUnitPond: any) {
    this._httpClient.put(this._url + `/${unitPond.getId()}`, updateUnitPond, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        if (res) {
          if (res as any) {
            this.copyValuesUnitPond(unitPond, updateUnitPond);
            unitPond.setMarker();
            unitPond.setSubscription();
            this._unitsPonds.next(this._unitsPonds.value);
          }
        }
      },
      err => {
        this._unitsPonds.error(err);
      }
    )
  }

  // ==================================================
  // Marker & MQTT
  // ==================================================

  addMarkersAndSubscribeMQTTAll() {
    this._unitsPonds.value.forEach(unitPond => {
      unitPond.setMarker();
      unitPond.setSubscription();
    });
    this._unitsPonds.next(this._unitsPonds.value);
  }

  removeMarkersAndUnsubscribeMQTTAll() {
    this._unitsPonds.value.forEach(unitPond => {
      unitPond.getMarker().remove();
      unitPond.getSubscription().unsubscribe();
    });
    this._unitsPonds.next(this._unitsPonds.value);
  }

  private setMapToUnitsPonds() {
    if (this._map) {
      this._unitsPonds.value.forEach(unitPond => {
        unitPond.setMap(this._map);
      });
    }
  }

  // ==================================================
  // UnitPond
  // ==================================================

  private createUnitPondWithResponseValues(res: any): UnitPondEntity {
    let newUnitPond: UnitPondEntity = this._unitFactory.createUnitPond();
    let newUnit: UnitEntity = this._unitFactory.createUnit();
    newUnitPond.setUnit(newUnit);
    this.copyValuesUnitPond(newUnitPond, res);
    newUnitPond.setSubscription();
    newUnitPond.setMarker();
    return newUnitPond;
  }

  private copyValuesUnitPond(target: UnitPondEntity, source: any) {
    target.setId(source.id);
    target.setM3(source.m3);
    target.setHeight(source.height);
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
