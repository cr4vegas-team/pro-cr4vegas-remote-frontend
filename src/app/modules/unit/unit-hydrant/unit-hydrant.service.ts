import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { TopicTypeEnum } from '../../../shared/constants/topic-type.enum';
import { AuthService } from '../../../shared/services/auth.service';
import { MqttEventsService } from '../../../shared/services/mqtt-events.service';
import { UnitHydrantCreateDto } from './dto/unit-hydrant-create.dto';
import { UnitHydrantUpdateDto } from './dto/unit-hydrant-update.dto';
import { UnitHydrantEntity } from './unit-hydrant.entity';
import { UnitHydrantFactory } from './unit-hydrant.factory';
import { UnitHydrantRO, UnitsHydrantsRO } from './unit-hydrant.interfaces';


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
    private readonly _unitHydrantFactory: UnitHydrantFactory,
    private readonly _mqttEventService: MqttEventsService,
  ) {
    this._unitsHydrants = new BehaviorSubject<UnitHydrantEntity[]>(Array<UnitHydrantEntity>());
  }

  public set map(map: Map) {
    if(map) {
      this._map = map;
      this.addAllMarkersToMap();
    }
  }

  public get unitsHydrants(): BehaviorSubject<UnitHydrantEntity[]> {
    return this._unitsHydrants;
  }

  updateUnitsHydrants() {
    this._unitsHydrants.next(this._unitsHydrants.value);
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

  async findAll() {
    const httpOptions = this._authService.getHttpOptions({});
    await this._httpClient.get<UnitsHydrantsRO>(this._url, httpOptions).subscribe(
      unitsHydrantsRO => {
        this._unitsHydrants.value.forEach(unitHydrant => {
          this.removeMarkerAndUnsubscribeMqtt(unitHydrant);
        });
        this._unitsHydrants.value.splice(0);
        unitsHydrantsRO.unitsHydrants.forEach((unitHydrant: UnitHydrantEntity) => {
          const newUnitHydrant: UnitHydrantEntity = this._unitHydrantFactory.createUnitHydrant(unitHydrant);
          this.addMarkerAndSubscribeMqtt(newUnitHydrant);
          this._unitsHydrants.value.push(newUnitHydrant);
        });
        this.updateUnitsHydrants();
      },
      error => {
        throw new Error(error);
      }
    );
  }

  create(unitHydrantCreateDto: UnitHydrantCreateDto): Observable<UnitHydrantRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<UnitHydrantRO>(this._url, unitHydrantCreateDto, httpOptions);
  }

  update(unitHydrantUpdateDto: UnitHydrantUpdateDto): Observable<UnitHydrantRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<UnitHydrantRO>(this._url, unitHydrantUpdateDto, httpOptions);
  }

  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================

  getOne(id: number): UnitHydrantEntity {
    return this._unitsHydrants.value.filter(unitHydrant => unitHydrant.id === id)[0];
  }

  // ==================================================
  // MQTT & MARKER
  // ==================================================

  addMarkersAndSubscribeMQTTAll() {
    this._unitsHydrants.value.forEach(unitHydrant => {
      this.addMarkerAndSubscribeMqtt(unitHydrant);
    });
    this._unitsHydrants.next(this._unitsHydrants.value);
  }

  addMarkerAndSubscribeMqtt(unitHydrant: UnitHydrantEntity) {
    unitHydrant.addMarker();
    this.addMarkerToMap(unitHydrant.marker);
    unitHydrant.addSubscription(this._mqttEventService.subscribe(TopicTypeEnum.UNIT_HYDRANT, unitHydrant.unit.code));
  }

  removeMarkersAndUnsubscribeMQTTAll() {
    this._unitsHydrants.value.forEach(unitHydrant => {
      this.removeMarkerAndUnsubscribeMqtt(unitHydrant);
    });
    this._unitsHydrants.next(this._unitsHydrants.value);
  }

  removeMarkerAndUnsubscribeMqtt(unitHydrant: UnitHydrantEntity) {
    unitHydrant.marker.remove();
    unitHydrant.subscription.unsubscribe();
  }

  //===========================================================
  // MAP
  //===========================================================

  private addAllMarkersToMap() {
    this._unitsHydrants.value.forEach(unitHydrant => {
      this.addMarkerToMap(unitHydrant.marker);
    })
  }

  private addMarkerToMap(marker: Marker) {
    if (this._map && marker) {
      marker.addTo(this._map);
    }
  }
}
