import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import { StationFactory } from '../../../modules/wrap/station/station.factory';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../../shared/services/auth.service';
import { MapService } from './../../../shared/services/map.service';
import { StationCreateDto } from './dto/station-create.dto';
import { StationUpdateDto } from './dto/station-update.dto';
import { StationEntity } from './station.entity';
import { StationRO, StationsRO } from './station.interfaces';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  private _url: string = GLOBAL.API + 'station';
  private _map: Map;
  private _stations: BehaviorSubject<StationEntity[]>;
  private _hiddenMarker = new BehaviorSubject<boolean>(false);

  // ==================================================

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _stationFactory: StationFactory,
    private readonly _mapService: MapService
  ) {
    this._stations = new BehaviorSubject<StationEntity[]>(
      Array<StationEntity>()
    );
    this._mapService.map.subscribe((map) => {
      if (map !== null) {
        this._map = map;
        this.addAllMarkersToMap();
      }
    });
    this._hiddenMarker.subscribe((hidden) => {
      this._stations.value.forEach((station) => {
        station.marker.getElement().hidden = hidden;
      });
    });
  }

  // ==================================================

  public get stations(): BehaviorSubject<StationEntity[]> {
    return this._stations;
  }

  // ==================================================

  public refresh(): void {
    this._stations.next(this._stations.value);
  }

  // ==================================================

  public hiddenMarkers(): BehaviorSubject<boolean> {
    return this._hiddenMarker;
  }

  // ==================================================

  public getFactory(): StationFactory {
    return this._stationFactory;
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

  findAll(): Observable<StationsRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<StationsRO>(this._url, httpOptions);
  }

  // ==================================================

  create(stationCreateDto: StationCreateDto): Observable<StationRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<StationRO>(
      this._url,
      stationCreateDto,
      httpOptions
    );
  }

  // ==================================================

  update(stationUpdateDto: StationUpdateDto): Observable<StationRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<StationRO>(
      this._url,
      stationUpdateDto,
      httpOptions
    );
  }

  // ==================================================
  // FRONT FUNCTIONS
  // ==================================================
  public addOne(station: StationEntity): void {
    this._stations.value.push(station);
    this.addMarkerToMap(station);
  }

  // ==================================================

  public getOne(id: number): StationEntity {
    return this._stations.value.filter((station) => station.id === id)[0];
  }

  // ==================================================

  public cleanAll(): void {
    this._stations.value.forEach((station) => {
      this._stationFactory.clean(station);
    });
    this._stations.value.splice(0);
  }

  // ===========================================================
  //  MAP
  // ===========================================================
  private addMarkerToMap(station: StationEntity): void {
    if (this._map && station.marker) {
      station.marker.addTo(this._map);
      if (this._hiddenMarker.value) {
        station.marker.getElement().hidden = false;
      } else {
        station.marker.getElement().hidden = true;
      }
    }
  }

  // ==================================================

  private addAllMarkersToMap(): void {
    this._stations.value.forEach((station) => {
      station.marker.addTo(this._map);
    });
  }
}
