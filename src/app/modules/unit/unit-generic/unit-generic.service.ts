import { UnitGenericFactory } from 'src/app/modules/unit/unit-generic/unit-generic.factory';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { IMqttMessage } from 'ngx-mqtt';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';
import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../../shared/services/auth.service';
import { MapService } from './../../../shared/services/map.service';
import { UnitGenericCreateDto } from './dto/unit-generic-create.dto';
import { UnitGenericUpdateDto } from './dto/unit-generic-update.dto';
import { UnitGenericWSDto } from './dto/unit-generic-ws.dto';
import { UnitGenericEntity } from './unit-generic.entity';
import { UnitGenericRO, UnitsGenericsRO } from './unit-generic.interfaces';

@Injectable({
  providedIn: 'root',
  deps: [AuthService],
})
export class UnitGenericService implements OnDestroy {
  // ==================================================
  //  VARS CONSTANT
  // ==================================================
  private _url: string = GLOBAL.API + 'unit-generic';
  // ==================================================
  //  VARS SUBJECTS
  // ==================================================
  private _unitsGenerics: BehaviorSubject<UnitGenericEntity[]>;
  private _hiddenMarker = new BehaviorSubject<boolean>(false);
  // ==================================================
  //  VARS SUBSCRIPTIONS
  // ==================================================
  private _subMap: Subscription;
  private _subHiddenMarker: Subscription;
  private _subServerUpdate: Subscription;
  private _subServerCreate: Subscription;
  // ==================================================
  //  VARS
  // ==================================================
  private _updateSended = false;
  private _createSended = false;

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _mapService: MapService,
    private readonly _mqttEventService: MqttEventsService,
    private readonly _unitGenericFactory: UnitGenericFactory
  ) {
    this._unitsGenerics = new BehaviorSubject<UnitGenericEntity[]>(
      Array<UnitGenericEntity>()
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
    if (this._subMap) {
      this._subMap.unsubscribe();
    }
    if (this._subHiddenMarker) {
      this._subHiddenMarker.unsubscribe();
    }
    if (this._subServerCreate) {
      this._subServerCreate.unsubscribe();
    }
    if (this._subServerUpdate) {
      this._subServerUpdate.unsubscribe();
    }
  }

  // ==================================================
  //  SUBSCRIPTIONS FUNCTIONS
  // ==================================================
  private subscribeToMap(): void {
    this._subMap = this._mapService.map.subscribe((map) => {
      if (map !== null) {
        this._unitsGenerics.value.forEach((unitGeneric) => {
          if (unitGeneric.marker) {
            unitGeneric.marker.addTo(map);
          }
        });
      }
    });
  }

  private subscribeToHiddenMarker(): void {
    this._subHiddenMarker = this._hiddenMarker.subscribe((hidden) => {
      this._unitsGenerics.value.forEach((unitGeneric) => {
        unitGeneric.marker.getElement().hidden = hidden;
      });
    });
  }

  private subscribeToServerCreate(): void {
    this._subServerCreate = this._mqttEventService
      .observe(
        TopicDestinationEnum.SERVER_DATA_CREATE,
        TopicTypeEnum.UNIT_GENERIC
      )
      .subscribe((data: IMqttMessage) => {
        if (this._createSended) {
          this._createSended = false;
        } else {
          const unitGenericWSDto = JSON.parse(data.payload.toString());
          const foundedUnitsGenerics = this._unitsGenerics.value.filter(
            (unitGeneric) => unitGeneric.id === unitGenericWSDto.id
          );
          if (foundedUnitsGenerics.length === 0) {
            const newUnitGeneric = this._unitGenericFactory.createUnitGeneric(
              unitGenericWSDto
            );
            this._unitsGenerics.value.push(newUnitGeneric);
            this.refresh();
          }
        }
      });
  }

  private subscribeToServerUpdate(): void {
    this._subServerUpdate = this._mqttEventService
      .observe(
        TopicDestinationEnum.SERVER_DATA_UPDATE,
        TopicTypeEnum.UNIT_GENERIC
      )
      .subscribe((data: IMqttMessage) => {
        if (this._updateSended) {
          this._updateSended = false;
        } else {
          const unitGenericWSDTo = JSON.parse(data.payload.toString());
          const foundedUnitsGenerics = this._unitsGenerics.value.filter(
            (unitGeneric) => unitGeneric.id === unitGenericWSDTo.id
          );
          if (foundedUnitsGenerics.length > 0) {
            const foundedUnitGeneric = foundedUnitsGenerics[0];
            this._unitGenericFactory.copyUnitGeneric(
              foundedUnitGeneric,
              unitGenericWSDTo
            );
            this.refresh();
          }
        }
      });
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================
  findAll(): Observable<UnitsGenericsRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<UnitsGenericsRO>(this._url, httpOptions);
  }

  create(
    unitGenericCreateDto: UnitGenericCreateDto
  ): Observable<UnitGenericRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<UnitGenericRO>(
      this._url,
      unitGenericCreateDto,
      httpOptions
    );
  }

  update(unitGenericDto: UnitGenericUpdateDto): Observable<UnitGenericRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<UnitGenericRO>(
      this._url,
      unitGenericDto,
      httpOptions
    );
  }

  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================
  public getUnitsGeneric(): BehaviorSubject<UnitGenericEntity[]> {
    return this._unitsGenerics;
  }

  public refresh(): void {
    this._unitsGenerics.next(this._unitsGenerics.value);
  }

  public getHiddenMarker(): BehaviorSubject<boolean> {
    return this._hiddenMarker;
  }

  public getOneByUnitId(unitId: number): UnitGenericEntity {
    return this._unitsGenerics.value.filter(
      (unitGeneric) => unitGeneric.unit.id === unitId
    )[0];
  }

  public cleanAll(): void {
    this._unitsGenerics.value.forEach((unitGeneric) => {
      this.clean(unitGeneric);
    });
    this._unitsGenerics.value.splice(0);
  }

  public clean(unitGeneric: UnitGenericEntity): void {
    if (unitGeneric.marker) {
      unitGeneric.marker.remove();
    }
    if (unitGeneric.nodeSubscription) {
      unitGeneric.nodeSubscription.unsubscribe();
    }
  }

  public publishCreateOnMQTT(unitGenericWSDto: UnitGenericWSDto): void {
    this._mqttEventService.publish(
      TopicDestinationEnum.SERVER_DATA_CREATE,
      TopicTypeEnum.UNIT_GENERIC,
      JSON.stringify(unitGenericWSDto)
    );
    this._createSended = true;
  }

  public publishUpdateOnMQTT(unitGenericWSDto: UnitGenericWSDto): void {
    this._mqttEventService.publish(
      TopicDestinationEnum.SERVER_DATA_UPDATE,
      TopicTypeEnum.UNIT_GENERIC,
      JSON.stringify(unitGenericWSDto)
    );
    this._updateSended = true;
  }
}
