import { Injectable } from '@angular/core';
import { Map } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import { UnitHydrantService } from './api/unit-hydrant.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _map: BehaviorSubject<Map>;

  constructor() { 
    this._map = new BehaviorSubject<Map>(null);
  }

  setMap(map: Map) {
    this._map.next(map);
  }

  get map(): Observable<Map> {
    return this._map.asObservable();
  }

  centerTo(longitude: number, latitude: number) {
    this._map.value.jumpTo({ zoom: 15.8, center: { lat: latitude, lng: longitude } });
  }

  setStyle(style: string) {
    this._map.value.setStyle(style);
  }
}
