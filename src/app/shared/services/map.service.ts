import { Injectable } from '@angular/core';
import { Map } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _map: Map;

  constructor() {
    this._map = null;
  }

  public set map(map: Map) {
    if (map) {
      this._map = map;
    }
  }

  centerTo(longitude: number, latitude: number) {
    this._map.jumpTo({ zoom: 15.8, center: { lat: latitude, lng: longitude } });
  }

  setStyle(style: string) {
    this._map.setStyle(style);
  }
}
