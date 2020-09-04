import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Map } from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { StationFactory } from '../../../modules/wrap/station/station.factory';
import { MapService } from '../../../shared/services/map.service';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { AuthService } from '../../../shared/services/auth.service';
import { StationCreateDto } from './dto/station-create.dto';
import { StationUpdateDto } from './dto/station-update.dto';
import { StationEntity } from './station.entity';
import { StationRO, StationsRO } from './station.interfaces';
import { PopupStationComponent } from './components/shared/popup-station/popup-station.component';

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
    private readonly _mapService: MapService,
    private readonly _stationFactory: StationFactory,
    private readonly _matDialog: MatDialog,
  ) {
    this._stations = new BehaviorSubject<StationEntity[]>(Array<StationEntity>());
    this._mapService.getMap().subscribe(
      (map: Map) => {
        if (map) {
          this._map = map;
          this.setMapToStations();
        }
      }
    );
    this._authService.observeAuthenticated().subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this.findAll();
        }
      }
    );
  }

  subscribeToStations(): BehaviorSubject<StationEntity[]> {
    return this._stations;
  }

  updateStations() {
    this._stations.next(this._stations.value);
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

  private async findAll(active?: number) {
    const httpOptions = this._authService.getHttpOptions(active ? true : false);
    active ? httpOptions.params.set('active', active.toString()) : '';
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
        this.updateStations();
        this.setMapToStations();
      },
      err => {
        this._stations.error(err);
      }
    );
  }

  async create(station: StationEntity) {

    const stationCreateDto: StationCreateDto = new StationCreateDto();
    stationCreateDto.code = station.code;
    stationCreateDto.name = station.name;
    stationCreateDto.altitude = station.altitude;
    stationCreateDto.latitude = station.latitude;
    stationCreateDto.longitude = station.longitude;

    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.post<StationRO>(this._url, stationCreateDto, httpOptions).subscribe(
      stationRO => {
        const newStation: StationEntity = this._stationFactory.createStation(stationRO.station);
        this.addMarker(newStation);
        this._stations.value.push(newStation);
        this.updateStations();
      },
      err => {
        this._stations.error(err);
      }
    )
  }

  async update(station: StationEntity) {

    const stationUpdateDto: StationUpdateDto = new StationUpdateDto();
    stationUpdateDto.id = station.id;
    stationUpdateDto.code = station.code;
    stationUpdateDto.name = station.name;
    stationUpdateDto.altitude = station.altitude;
    stationUpdateDto.latitude = station.latitude;
    stationUpdateDto.longitude = station.longitude;

    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.put<StationRO>(this._url, stationUpdateDto, httpOptions).subscribe(
      stationRO => {
        this._stationFactory.copyWithNewMarker(station, stationRO.station);
        this.addMarker(station);
        this.updateStations();
      },
      err => {
        this._stations.error(err);
      }
    )
  }

  remove(station: StationEntity) {
    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.delete(this._url + `/${station.id}`, httpOptions).subscribe(
      res => {
        if (res) {
          this.removeMarker(station);
          station.active = 0;
          this.updateStations();
        }
      },
      err => {
        this._stations.error(err);
      }
    )
  }

  active(station: StationEntity) {
    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.patch(this._url + `/${station.id}`, httpOptions).subscribe(
      res => {
        if (res) {
          this.addMarker(station);
          station.active = 1;
          this.updateStations();
        }
      },
      err => {
        this._stations.error(err);
      }
    )
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

  private addMarker(station: StationEntity) {
    station.addMarker().getElement().onclick = () => this._matDialog.open(PopupStationComponent, { data: station });
    station.marker.addTo(this._map);
  }

  removeMarkersAll() {
    this._stations.value.forEach(station => {
      this.removeMarker(station);
    });
    this._stations.next(this._stations.value);
  }

  private removeMarker(station: StationEntity) {
    station.marker.remove();
  }

  // ==================================================
  // MAP
  // ==================================================

  private setMapToStations() {
    if (this._map && this._stations.value) {
      this._stations.value.forEach(station => {
        this.addMarker(station);
      });
    }
  }

}
