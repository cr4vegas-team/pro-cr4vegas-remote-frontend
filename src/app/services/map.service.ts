import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Map } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _map: BehaviorSubject<Map>;

  constructor(
    private readonly _matDialog: MatDialog,
  ) {
    this._map = new BehaviorSubject(null);
  }

  // ==================================================
  // Map
  // ==================================================

  getMapObservable(): Observable<any> {
    return this._map;
  }

  setMap(map: Map) {
    this._map.next(map);
  }

  centerTo(longitude: number, latitude: number) {
    this._map.value.jumpTo({ zoom: 15.8, center: { lat: latitude, lng: longitude } });
  }

  setStyle(style: string) {
    this._map.value.setStyle(style);
  }

}
