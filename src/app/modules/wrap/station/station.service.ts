import { StationWSDto } from './dto/station-ws.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Map } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';
import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
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
  private _subServerUpdate: Subscription;
  private _subServerCreate: Subscription;

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _stationFactory: StationFactory,
    private readonly _mapService: MapService,
    private readonly _mqttEventService: MqttEventsService
  ) {
    this._stations = new BehaviorSubject<StationEntity[]>(
      Array<StationEntity>()
    );
    this.subscribeToMap();
    this.subscribeToHiddenMarker();
    this.subscribeToServerCreate();
    this.subscribeToServerUpdate();
  }

  // ==================================================
  //  LIFE CYCLE FUNCTIONS
  // ==================================================
  ngOnDestroy(): void {
    if (this._subServerCreate) {
      this._subServerCreate.unsubscribe();
    }
    if (this._subServerUpdate) {
      this._subServerUpdate.unsubscribe();
    }
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

  private subscribeToServerCreate(): void {
    this._subServerCreate = this._mqttEventService
      .observe(TopicDestinationEnum.SERVER_DATA_CREATE, TopicTypeEnum.STATION)
      .subscribe((data: IMqttMessage) => {
        const stationJSON = JSON.parse(data.payload.toString());
        const foundedStations = this._stations.value.filter(
          (station) => station.id === stationJSON.id
        );
        if (foundedStations.length === 0) {
          const newStation = this._stationFactory.createStation(stationJSON);
          this._stations.value.push(newStation);
          this.refresh();
        }
      });
  }

  private subscribeToServerUpdate(): void {
    this._subServerUpdate = this._mqttEventService
      .observe(TopicDestinationEnum.SERVER_DATA_UPDATE, TopicTypeEnum.STATION)
      .subscribe((data: IMqttMessage) => {
        const stationJSON = JSON.parse(data.payload.toString());
        const foundedStations = this._stations.value.filter(
          (station) => station.id === stationJSON.id
        );
        if (foundedStations.length > 0) {
          const foundedStation = foundedStations[0];
          this._stationFactory.updateStation(foundedStation, stationJSON);
          this.refresh();
        }
      });
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================
  public findAll(): Observable<StationsRO> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.get<StationsRO>(this._url, httpOptions);
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
      this._stationFactory.clean(station);
    });
    this._stations.value.splice(0);
  }

  public publishCreateOnMQTT(stationDto: StationWSDto): void {
    this._mqttEventService.publish(
      TopicDestinationEnum.SERVER_DATA_CREATE,
      TopicTypeEnum.STATION,
      JSON.stringify(stationDto)
    );
  }

  public publishUpdateOnMQTT(stationDto: StationWSDto): void {
    this._mqttEventService.publish(
      TopicDestinationEnum.SERVER_DATA_UPDATE,
      TopicTypeEnum.STATION,
      JSON.stringify(stationDto)
    );
  }
}
