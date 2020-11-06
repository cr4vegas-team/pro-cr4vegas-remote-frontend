import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Map } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../../shared/services/auth.service';
import { UnitGenericFactory } from '../unit-generic/unit-generic.factory';
import { MapService } from './../../../shared/services/map.service';
import { UnitGenericCreateDto } from './dto/unit-generic-create.dto';
import { UnitGenericUpdateDto } from './dto/unit-generic-update.dto';
import { UnitGenericEntity } from './unit-generic.entity';
import { UnitGenericRO, UnitsGenericsRO } from './unit-generic.interfaces';

@Injectable({
  providedIn: 'root',
  deps: [AuthService],
})
export class UnitGenericService {
  private _url: string = GLOBAL.API + 'unit-generic';
  private _map: Map;
  private _unitsGenerics: BehaviorSubject<UnitGenericEntity[]>;
  private _hiddenMarker = new BehaviorSubject<boolean>(false);

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
    this._mapService.map.subscribe((map) => {
      if (map) {
        this._map = map;
        this.addAllMarkersToMap();
      }
    });
    this._hiddenMarker.subscribe((hidden) => {
      this._unitsGenerics.value.forEach((unitGeneric) => {
        unitGeneric.marker.getElement().hidden = hidden;
      });
    });
  }

  // ==================================================

  public get unitsGenerics(): BehaviorSubject<UnitGenericEntity[]> {
    return this._unitsGenerics;
  }

  // ==================================================

  public refresh(): void {
    this._unitsGenerics.next(this._unitsGenerics.value);
  }

  // ==================================================

  public get factory(): UnitGenericFactory {
    return this._unitGenericFactory;
  }

  // ==================================================

  public get hiddenMarker(): BehaviorSubject<boolean> {
    return this._hiddenMarker;
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================
  findAll(): Observable<UnitsGenericsRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<UnitsGenericsRO>(this._url, httpOptions);
  }

  // ==================================================

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

  // ==================================================

  update(
    unitGenericUpdateDto: UnitGenericUpdateDto
  ): Observable<UnitGenericRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<UnitGenericRO>(
      this._url,
      unitGenericUpdateDto,
      httpOptions
    );
  }

  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================
  public addOne(unitGeneric: UnitGenericEntity): void {
    this._unitsGenerics.value.push(unitGeneric);
    this.addMarkerToMap(unitGeneric);
  }

  // ==================================================

  getOneByUnitId(unitId: number): UnitGenericEntity {
    return this._unitsGenerics.value.filter(
      (unitGeneric) => unitGeneric.unit.id === unitId
    )[0];
  }

  public cleanAll(): void {
    this._unitsGenerics.value.forEach((unitGeneric) => {
      this._unitGenericFactory.clean(unitGeneric);
    });
    this._unitsGenerics.value.splice(0);
  }

  // ===========================================================
  //  MAP
  // ===========================================================
  private addMarkerToMap(unitGeneric: UnitGenericEntity): void {
    if (this._map && unitGeneric.marker) {
      unitGeneric.marker.addTo(this._map);
      if (this._hiddenMarker.value) {
        unitGeneric.marker.getElement().hidden = false;
      } else {
        unitGeneric.marker.getElement().hidden = true;
      }
    }
  }

  // ==================================================

  private addAllMarkersToMap(): void {
    this._unitsGenerics.value.forEach((unitGeneric) => {
      unitGeneric.marker.addTo(this._map);
    });
  }
}
