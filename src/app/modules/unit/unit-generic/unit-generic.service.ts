import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UnitGenericFactory } from 'src/app/modules/unit/unit-generic/unit-generic.factory';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../auth/auth/auth.service';
import { MapService } from './../../../shared/services/map.service';
import { UnitGenericCreateDto } from './dto/unit-generic-create.dto';
import { UnitGenericUpdateDto } from './dto/unit-generic-update.dto';
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

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _mapService: MapService,
    private readonly _unitGenericFactory: UnitGenericFactory
  ) {
    this._unitsGenerics = new BehaviorSubject<UnitGenericEntity[]>(
      Array<UnitGenericEntity>()
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

  // ==================================================
  // API FUNCTIONS
  // ==================================================
  public findAll(): void {
    const httpOptions = this._authService.getHttpOptions({});
    this._httpClient.get<UnitsGenericsRO>(this._url, httpOptions).subscribe(
      (unitGenericRO) => {
        this.cleanAll();
        const unitGenericsFounded: UnitGenericEntity[] = [];
        unitGenericRO.unitsGenerics.forEach(
          (unitGeneric: UnitGenericEntity) => {
            const newUnitGeneric: UnitGenericEntity = this._unitGenericFactory.createUnitGeneric(
              unitGeneric
            );
            unitGenericsFounded.push(newUnitGeneric);
          }
        );
        this._unitsGenerics.next(unitGenericsFounded);
      },
      (error) => {
        throw new Error(error);
      }
    );
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
    this._unitsGenerics.next([]);
  }

  public clean(unitGeneric: UnitGenericEntity): void {
    if (unitGeneric.marker) {
      unitGeneric.marker.remove();
    }
    if (unitGeneric.mqttSubscription) {
      unitGeneric.mqttSubscription.unsubscribe();
    }
  }

  // ==================================================
  //  WS FUNCTIONS
  // ==================================================
  public createOrUpdateWS(unitGenericWSString: string): void {
    const unitGenericWS = this._unitGenericFactory.createUnitGeneric(unitGenericWSString);
    const unitGenericFound = this._unitsGenerics.value.filter(
      (station) => (station.id = unitGenericWS.id)
    )[0];
    if (unitGenericFound) {
      this._unitGenericFactory.copyUnitGeneric(unitGenericFound, unitGenericWS);
    } else {
      this._unitsGenerics.value.push(unitGenericWS);
    }
    this.refresh();
  }
}
