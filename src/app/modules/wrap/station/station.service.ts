import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Map } from 'mapbox-gl';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { StationFactory } from '../../../modules/wrap/station/station.factory';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../auth/auth/auth.service';
import { MapService } from './../../../shared/services/map.service';
import { StationCreateDto } from './dto/station-create.dto';
import { StationUpdateDto } from './dto/station-update.dto';
import { StationEntity } from './station.entity';
import { StationRO, StationsRO } from './station.interfaces';

@Injectable({
  providedIn: 'root',
})
export class StationService implements OnDestroy {
  // ==================================================
  //  VARS CONSTANTS
  // ==================================================
  private _url: string = GLOBAL.API + 'station';
  // ==================================================
  //  VARS
  // ==================================================
  private _map: Map;
  // ==================================================
  //  VARS SUBJECTS
  // ==================================================
  private _stations: BehaviorSubject<StationEntity[]>;
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
    private readonly _stationFactory: StationFactory,
    private readonly _mapService: MapService
  ) {
    this._stations = new BehaviorSubject<StationEntity[]>(
      Array<StationEntity>()
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
        this._map = map;
        this._stations.value.forEach((station) => {
          if (station.marker) {
            station.marker.addTo(map);
          }
        });
      }
    });
  }

  private subscribeToHiddenMarker(): void {
    this._subHiddenMarker = this._hiddenMarker.subscribe((hidden) => {
      this._stations.value.forEach((station) => {
        station.marker.getElement().hidden = hidden;
      });
    });
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================
  public findAll(): void {
    const httpOptions = this._authService.getHttpOptions({});
    this._httpClient.get<StationsRO>(this._url, httpOptions).subscribe(
      (stationsRO) => {
        this.cleanAll();
        stationsRO.stations.forEach((station: StationEntity) => {
          const newStation: StationEntity = this._stationFactory.createStation(
            station
          );
        });
        this.refresh();
      },
      (error) => {
        throw new Error(error);
      }
    );
  }

  public create(stationCreateDto: StationCreateDto): Observable<StationRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<StationRO>(
      this._url,
      stationCreateDto,
      httpOptions
    );
  }

  public update(stationUpdateDto: StationUpdateDto): Observable<StationRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<StationRO>(
      this._url,
      stationUpdateDto,
      httpOptions
    );
  }

  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================
  public getStations(): BehaviorSubject<StationEntity[]> {
    return this._stations;
  }

  public getOneStation(id: number): StationEntity {
    return this._stations.value.filter((station) => station.id === id)[0];
  }

  public getHiddenMarkers(): BehaviorSubject<boolean> {
    return this._hiddenMarker;
  }

  public refresh(): void {
    this._stations.next(this._stations.value);
  }

  public cleanAll(): void {
    this._stations.value.forEach((station) => {
      this.clean(station);
    });
    this._stations.value.splice(0);
    this._stations.next([]);
  }

  public clean(station: StationEntity): void {
    if (station.marker) {
      station.marker.remove();
    }
  }

  // ==================================================
  //  WS FUNCTIONS
  // ==================================================
  public createOrUpdateWS(stationWSString: string): void {
    const stationWS = this._stationFactory.createStation(stationWSString);
    const stationFound = this._stations.value.filter(
      (station) => (station.id = stationWS.id)
    )[0];
    if (stationFound) {
      this._stationFactory.copyStation(stationFound, stationWS);
    } else {
      this._stations.value.push(stationWS);
    }
    this.refresh();
  }
}
