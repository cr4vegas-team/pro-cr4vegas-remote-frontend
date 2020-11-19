import { Component, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Map, Marker } from 'mapbox-gl';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './page-map.component.html',
  styleUrls: ['./page-map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy {
  private _map: Map;
  loading = false;

  // ==================================================

  constructor(private readonly _mapService: MapService) {}

  // ==================================================

  ngOnInit(): void {
    try {
      const divMap = document.getElementById('map');
      (mapboxgl as any).accessToken =
        'pk.eyJ1IjoicnViZW5mZ3I4NyIsImEiOiJja2N4NHRhamMwMmltMzBvcG95aWdsemFqIn0.f_RXemAOG-ptjBUQc7H5uA';
      this._map = new Map({
        container: divMap,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [-2.363406, 36.897705],
        zoom: 11.66,
        attributionControl: false,
      });
      this._mapService.map.next(this._map);
    } catch (error) {
      console.log('Error al cargar el mapa');
    }
  }

  // ==================================================

  ngOnDestroy(): void {
    this._map.remove();
  }
}
