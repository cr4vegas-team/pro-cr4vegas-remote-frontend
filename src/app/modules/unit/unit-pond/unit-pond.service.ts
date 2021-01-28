import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
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
    private readonly _mapService: MapService
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
  public findAll(): void {
    const httpOptions = this._authService.getHttpOptions({});
    this._httpClient.get<UnitsPondsRO>(this._url, httpOptions).subscribe(
      (unitPondsRO) => {
        this.cleanAll();
        const unitsPondsFounded: UnitPondEntity[] = [];
        unitPondsRO.unitsPonds.forEach((unitPond: UnitPondEntity) => {
          const newUnitPond: UnitPondEntity = this._unitPondFactory.createUnitPond(
            unitPond
          );
          unitsPondsFounded.push(newUnitPond);
        });
        this._unitsPonds.next(unitsPondsFounded);
      }
    );
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
      this.clean(unitPond);
    });
    this._unitsPonds.value.splice(0);
    this._unitsPonds.next([]);
  }

  public clean(unitPond: UnitPondEntity): void {
    if (unitPond.marker) {
      unitPond.marker.remove();
    }
    if (unitPond.mqttNodeSubscription) {
      unitPond.mqttNodeSubscription.unsubscribe();
    }
  }

  // ==================================================
  //  WS FUNCTIONS
  // ==================================================
  public updateWS(unitPond: any): void {
    const unitPondFound = this._unitsPonds.value.filter(
      (station) => (station.id = unitPond.id)
    )[0];
    if (unitPondFound) {
      this._unitPondFactory.copyUnitPond(unitPondFound, unitPond);
      this.refresh();
    }
  }

  public crateWS(unitPond: any): void {
    this._unitsPonds.value.push(unitPond);
    this.refresh();
  }
}
