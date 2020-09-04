import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Map } from 'mapbox-gl';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './page-map.component.html',
  styleUrls: ['./page-map.component.css'],
})
export class MapComponent implements OnInit {

  constructor(
    private readonly _mapService: MapService
  ) { }

  ngOnInit() {
    try {
      let divMap: HTMLElement = document.getElementById('map');
      (mapboxgl as any).accessToken = 'pk.eyJ1IjoicnViZW5mZ3I4NyIsImEiOiJja2N4NHRhamMwMmltMzBvcG95aWdsemFqIn0.f_RXemAOG-ptjBUQc7H5uA';
      const map: Map = new Map({
        container: divMap,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [-2.508389, 36.963916],
        zoom: 15.8,
        scrollZoom: true,
        attributionControl: false,
      });
      this._mapService.setMap(map);
    } catch (error) {
      console.log("Error al cargar el mapa");
    }
  }

}