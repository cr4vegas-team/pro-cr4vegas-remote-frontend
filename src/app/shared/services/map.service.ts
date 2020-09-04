import { Injectable } from '@angular/core';
import { Map } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _mapSource: Map;
  private _map: BehaviorSubject<Map>;

  constructor(
  ) {
    this._map = new BehaviorSubject<Map>(null);
  }

  setMap(map: Map) {
    if (map) {
      this._mapSource = map;
      this._map.next(map);
    }
  }

  getMap(): Observable<Map> {
    return this._map.asObservable();
  }

  centerTo(longitude: number, latitude: number) {
    this._mapSource.jumpTo({ zoom: 15.8, center: { lat: latitude, lng: longitude } });
  }

  setStyle(style: string) {
    this._mapSource.setStyle(style);
  }
}
