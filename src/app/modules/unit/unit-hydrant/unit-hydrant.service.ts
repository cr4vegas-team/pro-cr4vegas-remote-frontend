import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../auth/auth/auth.service';
import { MapService } from './../../../shared/services/map.service';
import { UnitHydrantCreateDto } from './dto/unit-hydrant-create.dto';
import { UnitHydrantUpdateDto } from './dto/unit-hydrant-update.dto';
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
  //  VARS SUBJECTS
  // ==================================================
  private _unitsHydrants: BehaviorSubject<UnitHydrantEntity[]>;
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
    private readonly _unitHydrantFactory: UnitHydrantFactory,
    private readonly _mapService: MapService,
  ) {
    this._unitsHydrants = new BehaviorSubject<UnitHydrantEntity[]>(
      Array<UnitHydrantEntity>()
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

  // ==================================================
  //  WS FUNCTIONS
  // ==================================================
  public createOrUpdateWS(unitHydrantWSString: string): void {
    const unitHydrantWS = this._unitHydrantFactory.createUnitHydrant(unitHydrantWSString);
    const unitHydrantFound = this._unitsHydrants.value.filter(
      (station) => (station.id = unitHydrantWS.id)
    )[0];
    if (unitHydrantFound) {
      this._unitHydrantFactory.copyUnitHydrant(unitHydrantFound, unitHydrantWS);
    } else {
      this._unitsHydrants.value.push(unitHydrantWS);
    }
    this.refresh();
  }
}
