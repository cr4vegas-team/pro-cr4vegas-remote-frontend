import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Map } from 'mapbox-gl';

@Injectable({
  providedIn: 'root',
})
export class MapService {

  private _map: BehaviorSubject<Map>;

  constructor() {
    this._map = new BehaviorSubject<Map>(null);
  }

  public get map(): BehaviorSubject<Map> {
    return this._map;
  }

  centerTo(longitude: number, latitude: number): void {
    this._map.value.jumpTo({ zoom: 15.8, center: { lat: latitude, lng: longitude } });
  }

  setStyle(style: string): void {
    this._map.value.setStyle(style);
  }
}
