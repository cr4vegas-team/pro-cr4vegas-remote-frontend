import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { TopicTypeEnum } from '../../../shared/constants/topic-type.enum';
import { AuthService } from '../../../shared/services/auth.service';
import { MqttEventsService } from '../../../shared/services/mqtt-events.service';
import { UnitPondCreateDto } from './dto/unit-pond-create.dto';
import { UnitPondUpdateDto } from './dto/unit-pond-update.dto';
import { UnitPondEntity } from './unit-pond.entity';
import { UnitPondFactory } from './unit-pond.factory';
import { UnitPondRO, UnitsPondsRO } from './unit-pond.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UnitPondService {

  private _url: string = GLOBAL.API + 'unit-pond';

  private _unitsPonds: BehaviorSubject<UnitPondEntity[]>;

  private _map: Map;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _unitPondFactory: UnitPondFactory,
    private readonly _mqttEventService: MqttEventsService,
  ) {
    this._unitsPonds = new BehaviorSubject<UnitPondEntity[]>(Array<UnitPondEntity>());
  }

  public set map(map: Map) {
    if(map) {
      this._map = map;
      this.addAllMarkersToMap();
    }
  }

  public get unitsPonds(): BehaviorSubject<UnitPondEntity[]> {
    return this._unitsPonds;
  }

  updateUnitsPonds() {
    this._unitsPonds.next(this._unitsPonds.value);
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

   async findAll() {
    const httpOptions = this._authService.getHttpOptions({});
    await this._httpClient.get<UnitsPondsRO>(this._url, httpOptions).subscribe(
      unitsPondsRO => {
        this._unitsPonds.value.forEach(unitPond => {
          this.removeMarkerAndUnsubscribeMqtt(unitPond);
        });
        this._unitsPonds.value.splice(0);
        unitsPondsRO.unitsPonds.forEach((unitPond: UnitPondEntity) => {
          const newUnitPond: UnitPondEntity = this._unitPondFactory.createUnitPond(unitPond);
          this.addMarkerAndSubscribeMqtt(newUnitPond);
          this._unitsPonds.value.push(newUnitPond);
        });
        this.updateUnitsPonds();
      },
      error => {
        throw new Error(error);
      }
    );
  }

  create(unitPondCreateDto: UnitPondCreateDto): Observable<UnitPondRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<UnitPondRO>(this._url, unitPondCreateDto, httpOptions);
  }

  update(unitPondUpdateDto: UnitPondUpdateDto): Observable<UnitPondRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<UnitPondRO>(this._url, unitPondUpdateDto, httpOptions);
  }

  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================

  getOne(id: number): UnitPondEntity {
    return this._unitsPonds.value.filter(unitPond => unitPond.id === id)[0];
  }

  // ==================================================
  // MQTT & MARKER
  // ==================================================

  addMarkersAndSubscribeMQTTAll() {
    this._unitsPonds.value.forEach(unitPond => {
      this.addMarkerAndSubscribeMqtt(unitPond);
    });
    this._unitsPonds.next(this._unitsPonds.value);
  }

  addMarkerAndSubscribeMqtt(unitPond: UnitPondEntity) {
    unitPond.addMarker();
    this.addMarkerToMap(unitPond.marker);
    unitPond.addSubscription(this._mqttEventService.subscribe(TopicTypeEnum.UNIT_POND, unitPond.unit.code));
  }

  removeMarkersAndUnsubscribeMQTTAll() {
    this._unitsPonds.value.forEach(unitPond => {
      this.removeMarkerAndUnsubscribeMqtt(unitPond);
    });
    this._unitsPonds.next(this._unitsPonds.value);
  }

  removeMarkerAndUnsubscribeMqtt(unitPond: UnitPondEntity) {
    unitPond.marker.remove();
    unitPond.subscription.unsubscribe();
  }

    //===========================================================
  // MAP
  //===========================================================
  
  private addAllMarkersToMap() {
    this._unitsPonds.value.forEach(unitPond => {
      this.addMarkerToMap(unitPond.marker);
    })
  }
  
  private addMarkerToMap(marker: Marker) {
    if(this._map && marker) {
      marker.addTo(this._map);
    }
  }

}
