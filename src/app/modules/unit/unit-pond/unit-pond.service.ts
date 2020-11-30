import { UnitPondWSDto } from './dto/unit-pond-ws.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Map } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../../shared/services/auth.service';
import { MqttEventsService } from '../../../shared/services/mqtt-events.service';
import { MapService } from './../../../shared/services/map.service';
import { UnitPondCreateDto } from './dto/unit-pond-create.dto';
import { UnitPondUpdateDto } from './dto/unit-pond-update.dto';
import { UnitPondEntity } from './unit-pond.entity';
import { UnitPondFactory } from './unit-pond.factory';
import { UnitPondRO, UnitsPondsRO } from './unit-pond.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UnitPondService implements OnDestroy {
  // ==================================================
  //  VARS CONSTANTS
  // ==================================================
  private _url: string = GLOBAL.API + 'unit-pond';

  // ==================================================
  //  VARS
  // ==================================================
  private _createSended = false;
  private _updateSended = false;

  // ==================================================
  //  VARS SUBSJECTS
  // ==================================================
  private _unitsPonds: BehaviorSubject<UnitPondEntity[]>;
  private _hiddenMarker = new BehaviorSubject<boolean>(false);

  // ==================================================
  //  VARS SUBSCRIPTIONS
  // ==================================================
  private _subMap: Subscription;
  private _subHiddenMarker: Subscription;
  private _subServerUpdate: Subscription;
  private _subServerCreate: Subscription;

  // ==================================================
  //  CONSTRUCTOR
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
    this.subscribeToMap();
    this.subscribeToHiddenMarker();
    this.subscribeToServerCreate();
    this.subscribeToServerUpdate();
  }

  // ==================================================
  //  LIFE CYCLE FUNCTIONS
  // ==================================================
  ngOnDestroy(): void {
    if (this._subServerCreate) {
      this._subServerCreate.unsubscribe();
    }
    if (this._subServerUpdate) {
      this._subServerUpdate.unsubscribe();
    }
    if (this._subMap) {
      this._subMap.unsubscribe();
    }
    if (this._subHiddenMarker) {
      this._subHiddenMarker.unsubscribe();
    }
  }

  // ==================================================
  //  SUBSCRIPTIONS FUNCTIONS
  // ==================================================
  private subscribeToMap(): void {
    this._subMap = this._mapService.map.subscribe((map) => {
      if (map !== null) {
        this._unitsPonds.value.forEach((unitPond) => {
          if (unitPond.marker) {
            unitPond.marker.addTo(map);
          }
        });
      }
    });
  }

  private subscribeToHiddenMarker(): void {
    this._subHiddenMarker = this._hiddenMarker.subscribe((hidden) => {
      this._unitsPonds.value.forEach((unitPond) => {
        unitPond.marker.getElement().hidden = hidden;
      });
    });
  }

  private subscribeToServerCreate(): void {
    this._subServerCreate = this._mqttEventService
      .observe(TopicDestinationEnum.SERVER_DATA_CREATE, TopicTypeEnum.UNIT_POND)
      .subscribe((data: IMqttMessage) => {
        if (this._createSended) {
          this._createSended = false;
        } else {
          const unitPondWSDto = JSON.parse(data.payload.toString());
          const foundedUnitsPonds = this._unitsPonds.value.filter(
            (unitPond) => unitPond.id === unitPondWSDto.id
          );
          if (foundedUnitsPonds.length === 0) {
            const newUnitPond = this._unitPondFactory.createUnitPond(
              unitPondWSDto
            );
            this._unitsPonds.value.push(newUnitPond);
            this.refresh();
          }
        }
      });
  }

  private subscribeToServerUpdate(): void {
    this._subServerUpdate = this._mqttEventService
      .observe(TopicDestinationEnum.SERVER_DATA_UPDATE, TopicTypeEnum.UNIT_POND)
      .subscribe((data: IMqttMessage) => {
        if (this._updateSended) {
          this._updateSended = false;
        } else {
          const unitPondJSON = JSON.parse(data.payload.toString());
          const foundedUnitsPonds = this._unitsPonds.value.filter(
            (unitPond) => unitPond.id === unitPondJSON.id
          );
          if (foundedUnitsPonds.length > 0) {
            const foundedUnitPond = foundedUnitsPonds[0];
            this._unitPondFactory.updateUnitPond(foundedUnitPond, unitPondJSON);
            this.refresh();
          }
        }
      });
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================
  public findAll(): Observable<UnitsPondsRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<UnitsPondsRO>(this._url, httpOptions);
  }

  create(unitPondCreateDto: UnitPondCreateDto): Observable<UnitPondRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<UnitPondRO>(
      this._url,
      unitPondCreateDto,
      httpOptions
    );
  }

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
  public getUnitsPonds(): BehaviorSubject<UnitPondEntity[]> {
    return this._unitsPonds;
  }

  public refresh(): void {
    this._unitsPonds.next(this._unitsPonds.value);
  }

  public getHiddenMarker(): BehaviorSubject<boolean> {
    return this._hiddenMarker;
  }

  public getOneByUnitId(unitId: number): UnitPondEntity {
    return this._unitsPonds.value.filter(
      (unitPond) => unitPond.unit.id === unitId
    )[0];
  }

  public cleanAll(): void {
    this._unitsPonds.value.forEach((unitPond) => {
      this._unitPondFactory.clean(unitPond);
    });
    this._unitsPonds.value.splice(0);
  }

  public publishCreateOnMQTT(unitPondWSDto: UnitPondWSDto): void {
    this._mqttEventService.publish(
      TopicDestinationEnum.SERVER_DATA_CREATE,
      TopicTypeEnum.UNIT_POND,
      JSON.stringify(unitPondWSDto)
    );
    this._createSended = true;
  }

  public publishUpdateOnMQTT(unitPondWSDto: UnitPondWSDto): void {
    this._mqttEventService.publish(
      TopicDestinationEnum.SERVER_DATA_UPDATE,
      TopicTypeEnum.STATION,
      JSON.stringify(unitPondWSDto)
    );
    this._updateSended = true;
  }
}