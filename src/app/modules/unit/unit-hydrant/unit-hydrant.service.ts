import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Map } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../../shared/services/auth.service';
import { MapService } from './../../../shared/services/map.service';
import { UnitHydrantCreateDto } from './dto/unit-hydrant-create.dto';
import { UnitHydrantUpdateDto } from './dto/unit-hydrant-update.dto';
import { UnitHydrantEntity } from './unit-hydrant.entity';
import { UnitHydrantFactory } from './unit-hydrant.factory';
import { UnitHydrantRO, UnitsHydrantsRO } from './unit-hydrant.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UnitHydrantService {
  private _url: string = GLOBAL.API + 'unit-hydrant';
  private _map: Map;
  private _unitsHydrants: BehaviorSubject<UnitHydrantEntity[]>;
  private _hiddenMarker = new BehaviorSubject<boolean>(false);

  // ==================================================

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _unitHydrantFactory: UnitHydrantFactory,
    private readonly _mapService: MapService
  ) {
    this._unitsHydrants = new BehaviorSubject<UnitHydrantEntity[]>(
      Array<UnitHydrantEntity>()
    );
    this._mapService.map.subscribe((map) => {
      if (map) {
        this._map = map;
        this.addAllMarkersToMap();
      }
    });
    this._hiddenMarker.subscribe((hidden) => {
      this._unitsHydrants.value.forEach((unitHydrant) => {
        unitHydrant.marker.getElement().hidden = hidden;
      });
    });
  }

  // ==================================================

  public get unitsHydrants(): BehaviorSubject<UnitHydrantEntity[]> {
    return this._unitsHydrants;
  }

  // ==================================================

  public refresh(): void {
    this._unitsHydrants.next(this._unitsHydrants.value);
  }

  // ==================================================

  public get factory(): UnitHydrantFactory {
    return this._unitHydrantFactory;
  }

  // ==================================================

  public get hiddenMarker(): BehaviorSubject<boolean> {
    return this._hiddenMarker;
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
  public addOne(unitHydrant: UnitHydrantEntity): void {
    this._unitsHydrants.value.push(unitHydrant);
    this.addMarkerToMap(unitHydrant);
  }

  public getOneByUnitId(id: number): UnitHydrantEntity {
    return this._unitsHydrants.value.filter(
      (unitHydrant) => unitHydrant.id === id
    )[0];
  }

  public cleanAll(): void {
    this._unitsHydrants.value.forEach((unitHydrant) => {
      this._unitHydrantFactory.clean(unitHydrant);
    });
  }

  // ===========================================================
  //  MAP
  // ===========================================================
  private addMarkerToMap(unitHydrant: UnitHydrantEntity): void {
    if (this._map && unitHydrant.marker) {
      unitHydrant.marker.addTo(this._map);
      if (this._hiddenMarker.value) {
        unitHydrant.marker.getElement().hidden = false;
      } else {
        unitHydrant.marker.getElement().hidden = true;
      }
    }
  }

  // ==================================================

  private addAllMarkersToMap(): void {
    this._unitsHydrants.value.forEach((unitHydrant) => {
      unitHydrant.marker.addTo(this._map);
    });
  }
}
