import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { TopicTypeEnum } from '../../../shared/constants/topic-type.enum';
import { AuthService } from '../../../shared/services/auth.service';
import { MqttEventsService } from '../../../shared/services/mqtt-events.service';
import { UnitGenericFactory } from '../unit-generic/unit-generic.factory';
import { UnitGenericCreateDto } from './dto/unit-generic-create.dto';
import { UnitGenericUpdateDto } from './dto/unit-generic-update.dto';
import { UnitGenericEntity } from './unit-generic.entity';
import { UnitGenericRO, UnitsGenericsRO } from './unit-generic.interfaces';


@Injectable({
  providedIn: 'root',
  deps: [AuthService]
})
export class UnitGenericService {

  private _url: string = GLOBAL.API + 'unit-generic';

  private _unitsGenerics: BehaviorSubject<UnitGenericEntity[]>;
  private _map: Map;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _unitGenericFactory: UnitGenericFactory,
    private readonly _mqttEventService: MqttEventsService,
  ) {
    this._unitsGenerics = new BehaviorSubject<UnitGenericEntity[]>(Array<UnitGenericEntity>());
  }

  public set map(map: Map) {
    if (map) {
      this._map = map;
      this.addAllMarkersToMap();
    }
  }

  public get unitsGenerics(): BehaviorSubject<UnitGenericEntity[]> {
    return this._unitsGenerics;
  }

  updateUnitsGenerics() {
    this._unitsGenerics.next(this._unitsGenerics.value);
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

  async findAll() {
    const httpOptions = this._authService.getHttpOptions({});
    await this._httpClient.get<UnitsGenericsRO>(this._url, httpOptions).subscribe(
      unitsGenericsRO => {
        this._unitsGenerics.value.forEach(unitGeneric => {
          this.removeMarkersAndUnsubscribeMqtt(unitGeneric);
        });
        this._unitsGenerics.value.splice(0);
        unitsGenericsRO.unitsGenerics.forEach((unitGeneric: UnitGenericEntity) => {
          const newUnitGeneric: UnitGenericEntity = this._unitGenericFactory.createUnitGeneric(unitGeneric);
          this.addMarkerAndSubscribeMqtt(newUnitGeneric);
          this._unitsGenerics.value.push(newUnitGeneric);
        });
        this.updateUnitsGenerics();
      },
      error => {
        throw new Error(error);
      }
    );
  }

  create(unitGenericCreateDto: UnitGenericCreateDto): Observable<UnitGenericRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<UnitGenericRO>(this._url, unitGenericCreateDto, httpOptions);
  }

  update(unitGenericUpdateDto: UnitGenericUpdateDto): Observable<UnitGenericRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<UnitGenericRO>(this._url, unitGenericUpdateDto, httpOptions);
  }

  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================

  getOne(id: number): UnitGenericEntity {
    return this._unitsGenerics.value.filter(unitGeneric => unitGeneric.id === id)[0];
  }

  // ==================================================
  // Marker & MQTT
  // ==================================================

  addMarkersAndSubscribeMQTTAll() {
    this._unitsGenerics.value.forEach(unitGeneric => {
      this.addMarkerAndSubscribeMqtt(unitGeneric);
    });
    this._unitsGenerics.next(this._unitsGenerics.value);
  }

  addMarkerAndSubscribeMqtt(unitGeneric: UnitGenericEntity) {
    unitGeneric.addMarker();
    this.addMarkerToMap(unitGeneric.marker);
    unitGeneric.addSubscription(this._mqttEventService.subscribe(TopicTypeEnum.UNIT_GENERIC, unitGeneric.unit.code));
  }

  removeMarkersAndUnsubscribeMQTTAll() {
    this._unitsGenerics.value.forEach(unitGeneric => {
      this.removeMarkersAndUnsubscribeMqtt(unitGeneric);
    });
    this._unitsGenerics.next(this._unitsGenerics.value);
  }

  removeMarkersAndUnsubscribeMqtt(unitGeneric: UnitGenericEntity) {
    unitGeneric.marker.remove();
    unitGeneric.subscription.unsubscribe();
  }

  //===========================================================
  // MAP
  //===========================================================

  private addAllMarkersToMap() {
    this._unitsGenerics.value.forEach(unitGeneric => {
      this.addMarkerToMap(unitGeneric.marker);
    })
  }

  private addMarkerToMap(marker: Marker) {
    if (this._map && marker) {
      marker.addTo(this._map);
    }
  }
}
