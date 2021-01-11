import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MQTTPacket } from 'src/app/shared/models/mqtt-packet.model';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../auth/auth/auth.service';
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
  //  VARS SUBSJECTS
  // ==================================================
  private _unitsPonds: BehaviorSubject<UnitPondEntity[]>;
  private _hiddenMarker = new BehaviorSubject<boolean>(false);

  // ==================================================
  //  VARS SUBSCRIPTIONS
  // ==================================================
  private _subMap: Subscription;
  private _subHiddenMarker: Subscription;

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _unitPondFactory: UnitPondFactory,
    private readonly _mapService: MapService,
  ) {
    this._unitsPonds = new BehaviorSubject<UnitPondEntity[]>(
      Array<UnitPondEntity>()
    );
    this.subscribeToMap();
    this.subscribeToHiddenMarker();
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

  // ==================================================
  //  WS FUNCTIONS
  // ==================================================
  public createWS(unitPondWSString: string): void {
    const unitPondWS = this._unitPondFactory.createUnitPond(unitPondWSString);
    this._unitsPonds.value.push(unitPondWS);
    this.refresh();
  }

  public updateWS(unitPondWSString: string): void {
    const unitPondWS = this._unitPondFactory.createUnitPond(unitPondWSString);
    const unitPondFound = this._unitsPonds.value.filter(
      (unitPond) => (unitPond.id = unitPondWS.id)
    )[0];
    if (unitPondFound) {
      this._unitPondFactory.copyUnitPond(unitPondFound, unitPondWS);
    }
  }

  public extractMQTTPacketAndAct(mqttPacket: MQTTPacket): void {
    const topicSplit = mqttPacket.topic.split('/');
    const topicSplitLengh = topicSplit.length;
    const unitPondID = Number.parseInt(topicSplitLengh[topicSplitLengh - 1]);
    const unitPondFound = this._unitsPonds.value.filter(
      (unitPond) => (unitPond.id = unitPondID)
    )[0];
    if (unitPondFound) {
      this._unitPondFactory.updateProperties(unitPondFound, mqttPacket.message);
    }
  }
}
