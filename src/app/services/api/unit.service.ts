import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Map } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import { MapService } from '../map.service';
import { MqttEventsService } from '../mqtt-events.service';
import { UnitFactory } from '../../factories/unit.factory';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private _map: Map;
  private _ready: BehaviorSubject<boolean>;
  private _unitFactory: UnitFactory;

  constructor(
    private readonly _mqttEventsService: MqttEventsService,
    private readonly _mapService: MapService,
    private readonly _matDialog: MatDialog,
  ) {
    this._ready = new BehaviorSubject<boolean>(false);
    this._mapService.map.subscribe(map => {
      if (map) {
        this._map = map;
        this._unitFactory = new UnitFactory(this._map, this._matDialog, this._mqttEventsService);
        this._ready.next(true);
      }
    });
  }

  ready(): Observable<boolean> {
    return this._ready.asObservable();
  }

  public get unitFactory(): UnitFactory {
    return this._unitFactory;
  }

}
