import { MapService } from './../../../shared/services/map.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { PondStateEnum } from 'src/app/shared/constants/pond-state.enum';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { TopicTypeEnum } from '../../../shared/constants/topic-type.enum';
import { AuthService } from '../../../shared/services/auth.service';
import { MqttEventsService } from '../../../shared/services/mqtt-events.service';
import { UnitPondCreateDto } from './dto/unit-pond-create.dto';
import { UnitPondUpdateDto } from './dto/unit-pond-update.dto';
import { UnitPondEntity } from './unit-pond.entity';
import { UnitPondFactory } from './unit-pond.factory';
import { UnitPondRO, UnitsPondsRO } from './unit-pond.interfaces';
import { IMqttMessage } from 'ngx-mqtt';

@Injectable({
  providedIn: 'root',
})
export class UnitPondService {
  private _url: string = GLOBAL.API + 'unit-pond';
  private _map: Map;
  private _unitsPonds: BehaviorSubject<UnitPondEntity[]>;
  private _hiddenMarker = new BehaviorSubject<boolean>(false);

  // ==================================================

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _unitPondFactory: UnitPondFactory,
    private readonly _mqttEventService: MqttEventsService,
    private readonly _mapService: MapService
  ) {
    this._unitsPonds = new BehaviorSubject<UnitPondEntity[]>(
      Array<UnitPondEntity>()
    );
    this._mapService.map.subscribe((map) => {
      if (map) {
        this._map = map;
        this.addAllMarkersToMap();
      }
    });
    this._hiddenMarker.subscribe((hidden) => {
      this._unitsPonds.value.forEach((unitPond) => {
        unitPond.marker.getElement().hidden = hidden;
      });
    });
  }

  // ==================================================

  public get unitsPonds(): BehaviorSubject<UnitPondEntity[]> {
    return this._unitsPonds;
  }

  // ==================================================

  public refresh(): void {
    this._unitsPonds.next(this._unitsPonds.value);
  }

  // ==================================================

  public get factory(): UnitPondFactory {
    return this._unitPondFactory;
  }

  // ==================================================

  public get hiddenMarker(): BehaviorSubject<boolean> {
    return this._hiddenMarker;
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================
  public findAll(): Observable<UnitsPondsRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<UnitsPondsRO>(this._url, httpOptions);
  }

  // ==================================================

  create(unitPondCreateDto: UnitPondCreateDto): Observable<UnitPondRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<UnitPondRO>(
      this._url,
      unitPondCreateDto,
      httpOptions
    );
  }

  // ==================================================

  update(unitPondUpdateDto: UnitPondUpdateDto): Observable<UnitPondRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<UnitPondRO>(
      this._url,
      unitPondUpdateDto,
      httpOptions
    );
  }

  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================
  public addOne(unitPond: UnitPondEntity): void {
    this._unitsPonds.value.push(unitPond);
    this.addMarkerToMap(unitPond);
  }

  getOneByUnitId(id: number): UnitPondEntity {
    return this._unitsPonds.value.filter((unitPond) => unitPond.id === id)[0];
  }

  public cleanAll(): void {
    this._unitsPonds.value.forEach((unitPond) => {
      this._unitPondFactory.clean(unitPond);
    });
    this._unitsPonds.value.splice(0);
  }

  // ===========================================================
  //  MAP
  // ===========================================================
  private addMarkerToMap(unitPond: UnitPondEntity): void {
    if (this._map && unitPond.marker) {
      unitPond.marker.addTo(this._map);
      if (this._hiddenMarker.value) {
        unitPond.marker.getElement().hidden = false;
      } else {
        unitPond.marker.getElement().hidden = true;
      }
    }
  }

  // ==================================================

  private addAllMarkersToMap(): void {
    this._unitsPonds.value.forEach((unitPond) => {
      unitPond.marker.addTo(this._map);
    });
  }
}
