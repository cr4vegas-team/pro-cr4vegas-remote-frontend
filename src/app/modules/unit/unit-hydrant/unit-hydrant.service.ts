import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Map } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';
import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../../shared/services/auth.service';
import { MapService } from './../../../shared/services/map.service';
import { UnitHydrantCreateDto } from './dto/unit-hydrant-create.dto';
import { UnitHydrantUpdateDto } from './dto/unit-hydrant-update.dto';
import { UnitHydrantWSDto } from './dto/unit-hydrant-ws.dto';
import { UnitHydrantEntity } from './unit-hydrant.entity';
import { UnitHydrantFactory } from './unit-hydrant.factory';
import { UnitHydrantRO, UnitsHydrantsRO } from './unit-hydrant.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UnitHydrantService implements OnDestroy {
  // ==================================================
  //  VARS CONSTANT
  // ==================================================
  private _url: string = GLOBAL.API + 'unit-hydrant';
  // ==================================================
  //  VARS
  // ==================================================
  private _createSended = false;
  private _updateSended = false;
  // ==================================================
  //  VARS SUBJECTS
  // ==================================================
  private _unitsHydrants: BehaviorSubject<UnitHydrantEntity[]>;
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
    private readonly _unitHydrantFactory: UnitHydrantFactory,
    private readonly _mapService: MapService,
    private readonly _mqttEventService: MqttEventsService
  ) {
    this._unitsHydrants = new BehaviorSubject<UnitHydrantEntity[]>(
      Array<UnitHydrantEntity>()
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
        this._unitsHydrants.value.forEach((unitHydrant) => {
          if (unitHydrant.marker) {
            unitHydrant.marker.addTo(map);
          }
        });
      }
    });
  }

  private subscribeToHiddenMarker(): void {
    this._subHiddenMarker = this._hiddenMarker.subscribe((hidden) => {
      this._unitsHydrants.value.forEach((unitHydrant) => {
        unitHydrant.marker.getElement().hidden = hidden;
      });
    });
  }

  private subscribeToServerCreate(): void {
    this._subServerCreate = this._mqttEventService
      .observe(
        TopicDestinationEnum.SERVER_DATA_CREATE,
        TopicTypeEnum.UNIT_HYDRANT
      )
      .subscribe((data: IMqttMessage) => {
        if (this._createSended) {
          this._createSended = false;
        } else {
          const unitHydrantWSDto = JSON.parse(data.payload.toString());
          const foundedUnitsHydrants = this._unitsHydrants.value.filter(
            (unitHydrant) => unitHydrant.id === unitHydrantWSDto.id
          );
          if (foundedUnitsHydrants.length === 0) {
            const newUnitHydrant = this._unitHydrantFactory.createUnitHydrant(
              unitHydrantWSDto
            );
            this._unitsHydrants.value.push(newUnitHydrant);
            this.refresh();
          }
        }
      });
  }

  private subscribeToServerUpdate(): void {
    this._subServerUpdate = this._mqttEventService
      .observe(
        TopicDestinationEnum.SERVER_DATA_UPDATE,
        TopicTypeEnum.UNIT_HYDRANT
      )
      .subscribe((data: IMqttMessage) => {
        if (this._updateSended) {
          this._updateSended = false;
        } else {
          const unitHydrantWSDto = JSON.parse(data.payload.toString());
          const foundedUnitsHydrants = this._unitsHydrants.value.filter(
            (unitHydrant) => unitHydrant.id === unitHydrantWSDto.id
          );
          if (foundedUnitsHydrants.length > 0) {
            const foundedUnitHydrant = foundedUnitsHydrants[0];
            this._unitHydrantFactory.copyUnitHydrant(
              foundedUnitHydrant,
              unitHydrantWSDto
            );
            this.refresh();
          }
        }
      });
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================
  public findAll(): Observable<UnitsHydrantsRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<UnitsHydrantsRO>(this._url, httpOptions);
  }

  create(
    unitHydrantCreateDto: UnitHydrantCreateDto
  ): Observable<UnitHydrantRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<UnitHydrantRO>(
      this._url,
      unitHydrantCreateDto,
      httpOptions
    );
  }

  update(
    unitHydrantUpdateDto: UnitHydrantUpdateDto
  ): Observable<UnitHydrantRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<UnitHydrantRO>(
      this._url,
      unitHydrantUpdateDto,
      httpOptions
    );
  }

  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================
  public getUnitsHydrants(): BehaviorSubject<UnitHydrantEntity[]> {
    return this._unitsHydrants;
  }

  public refresh(): void {
    this._unitsHydrants.next(this._unitsHydrants.value);
  }

  public getHiddenMarker(): BehaviorSubject<boolean> {
    return this._hiddenMarker;
  }

  public getOneByUnitId(id: number): UnitHydrantEntity {
    return this._unitsHydrants.value.filter(
      (unitHydrant) => unitHydrant.unit.id === id
    )[0];
  }

  public cleanAll(): void {
    this._unitsHydrants.value.forEach((unitHydrant) => {
      this._unitHydrantFactory.clean(unitHydrant);
    });
  }

  public publishCreateOnMQTT(unitHydrantWSDto: UnitHydrantWSDto): void {
    this._mqttEventService.publish(
      TopicDestinationEnum.SERVER_DATA_CREATE,
      TopicTypeEnum.UNIT_HYDRANT,
      JSON.stringify(unitHydrantWSDto)
    );
    this._createSended = true;
  }

  public publishUpdateOnMQTT(unitHydrantWSDto: UnitHydrantWSDto): void {
    this._mqttEventService.publish(
      TopicDestinationEnum.SERVER_DATA_UPDATE,
      TopicTypeEnum.UNIT_HYDRANT,
      JSON.stringify(unitHydrantWSDto)
    );
    this._updateSended = true;
  }
}
