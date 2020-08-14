import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Map } from 'mapbox-gl';
import { UnitHydrantService } from '../../../services/api/unit-hydrant.service';
import { MapService } from '../../../services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {

  private _map: Map;

  constructor(
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _mapService: MapService,
  ) { }

  ngOnInit() {
    if (!this._map) {
      this.createMap();
    }
  }

  private createMap() {
    while (!this._map) {
      try {
        (mapboxgl as any).accessToken = 'pk.eyJ1IjoicnViZW5mZ3I4NyIsImEiOiJja2N4NHRhamMwMmltMzBvcG95aWdsemFqIn0.f_RXemAOG-ptjBUQc7H5uA';
        this._map = new Map({
          container: document.getElementById('map'),
          style: 'mapbox://styles/mapbox/satellite-v9',
          center: [-2.415919, 36.875355],
          zoom: 15.8,
          scrollZoom: true,
          attributionControl: false,
        });
        this._mapService.setMap(this._map);
      } catch (error) {
        console.log(error);
      }
    }
  }
  
}