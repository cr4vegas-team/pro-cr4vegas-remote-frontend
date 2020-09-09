import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Map, Marker } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import { StationFactory } from '../../../modules/wrap/station/station.factory';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../../shared/services/auth.service';
import { StationCreateDto } from './dto/station-create.dto';
import { StationUpdateDto } from './dto/station-update.dto';
import { StationEntity } from './station.entity';
import { StationRO, StationsRO } from './station.interfaces';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  private _url: string = GLOBAL.API + 'station';

  private _stations: BehaviorSubject<StationEntity[]>;
  private _map: Map;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _stationFactory: StationFactory,
  ) {
    this._stations = new BehaviorSubject<StationEntity[]>(Array<StationEntity>());
    this._authService.isAuthenticated().subscribe(
      authenticated => {
        if(authenticated) {
          this.findAll();
        }
      }
    );
  }

  public set map(map: Map) {
    if(map) {
      this._map = map;
      this.addAllMarkersToMap();
    }
  }

  public get stations(): BehaviorSubject<StationEntity[]> {
    return this._stations;
  }

  next() {
    this._stations.next(this._stations.value);
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

  async findAll() {
    const httpOptions = this._authService.getHttpOptions({});
    await this._httpClient.get<StationsRO>(this._url, httpOptions).subscribe(
      stationsRO => {
        this._stations.value.forEach(station => {
          this.removeMarker(station)
        });
        this._stations.value.splice(0);
        stationsRO.stations.forEach((station: StationEntity) => {
          const newStation: StationEntity = this._stationFactory.createStation(station);
          this.addMarker(newStation);
          this._stations.value.push(newStation);
        });
        this.next();
      },
      error => {
        throw new Error(error);
      }
    );
  }

  create(stationCreateDto: StationCreateDto): Observable<StationRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.post<StationRO>(this._url, stationCreateDto, httpOptions);
  }

  update(stationUpdateDto: StationUpdateDto) {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<StationRO>(this._url, stationUpdateDto, httpOptions);
  }

  remove(station: StationEntity): Observable<boolean> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.delete<boolean>(this._url + `/${station.id}`, httpOptions);
  }

  active(station: StationEntity): Observable<boolean> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.patch<boolean>(this._url + `/${station.id}`, httpOptions);
  }

  // ==================================================
  // FRONT FUNCTIOSN
  // ==================================================
  getOne(id: number): StationEntity {
    return this._stations.value.filter(station => station.id === id)[0];
  }

  // ==================================================
  // Marker & MQTT
  // ==================================================

  addMarkersAll() {
    this._stations.value.forEach(station => {
      this.addMarker(station);
    });
    this._stations.next(this._stations.value);
  }

  addMarker(station: StationEntity) {
    station.addMarker();
    this.addMarkerToMap(station.marker);
  }

  removeMarkersAll() {
    this._stations.value.forEach(station => {
      this.removeMarker(station);
    });
    this._stations.next(this._stations.value);
  }

  removeMarker(station: StationEntity) {
    station.marker.remove();
  }

  //===========================================================
  // MAP
  //===========================================================
  
  private addAllMarkersToMap() {
    this._stations.value.forEach(station => {
      this.addMarkerToMap(station.marker);
    })
  }
  
  private addMarkerToMap(marker: Marker) {
    if(this._map && marker) {
      marker.addTo(this._map);
    }
  }

}
