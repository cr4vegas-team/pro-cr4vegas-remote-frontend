import { Injectable } from '@angular/core';
import { Map } from 'mapbox-gl';
import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _map: Map;

  constructor() { }

  createAndLoadMap(container: HTMLElement): Map {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoicnViZW5mZ3I4NyIsImEiOiJja2N4NHRhamMwMmltMzBvcG95aWdsemFqIn0.f_RXemAOG-ptjBUQc7H5uA';
    this._map = new mapboxgl.Map({
      container: container,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [-2.415919, 36.875355],
      zoom: 15.8,
      scrollZoom: true,
      attributionControl: false,
    });
    this._map.addControl(new mapboxgl.FullscreenControl());
    return this._map;
  }

  removeMap() {
    this._map.remove();
  }

  getMap(): Map {
    return this._map;
  }

  centerTo(longitude: number, latitude: number) {
    this._map.jumpTo({ zoom: 15.8, center: { lat: latitude, lng: longitude } });
  }

}
