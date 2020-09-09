import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as mapboxgl from 'mapbox-gl';
import { Map } from 'mapbox-gl';
import { DialogUnitGenericComponent } from 'src/app/modules/unit/unit-generic/components/dialog-unit-generic/dialog-unit-generic.component';
import { UnitGenericService } from 'src/app/modules/unit/unit-generic/unit-generic.service';
import { DialogUnitHydrantComponent } from 'src/app/modules/unit/unit-hydrant/components/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { DialogUnitPondComponent } from 'src/app/modules/unit/unit-pond/components/dialog-unit-pond/dialog-unit-pond.component';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { DialogStationComponent } from 'src/app/modules/wrap/station/components/dialog-station/dialog-station.component';
import { StationService } from 'src/app/modules/wrap/station/station.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './page-map.component.html',
  styleUrls: ['./page-map.component.css'],
})
export class MapComponent implements OnInit {

  private _map: Map;
  loading: boolean = false;

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _mapService: MapService,
    private readonly _unitGenericService: UnitGenericService,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitPondService: UnitPondService,
    private readonly _stationService: StationService,
  ) {
    this._unitGenericService.unitsGenerics.subscribe(
      unitsGenerics => {
        unitsGenerics.forEach(unitGeneric => {
          unitGeneric.marker.getElement().onclick = () => this._matDialog.open(DialogUnitGenericComponent, { data: unitGeneric });
        });
      }
    )
    this._unitHydrantService.unitsHydrants.subscribe(
      unitsHydrants => {
        unitsHydrants.forEach(unitHydrant => {
          unitHydrant.marker.getElement().onclick = () => this._matDialog.open(DialogUnitHydrantComponent, { data: unitHydrant });
        });
      }
    )
    this._unitPondService.unitsPonds.subscribe(
      unitsPonds => {
        unitsPonds.forEach(unitPond => {
          unitPond.marker.getElement().onclick = () => this._matDialog.open(DialogUnitPondComponent, { data: unitPond });
        });
      }
    )
    this._stationService.stations.subscribe(
      stations => {
        stations.forEach(station => {
          station.marker.getElement().onclick = () => this._matDialog.open(DialogStationComponent, { data: station });
        });
      }
    )
  }

  async ngOnInit() {
    try {
      let divMap: HTMLElement = document.getElementById('map');
      (mapboxgl as any).accessToken = 'pk.eyJ1IjoicnViZW5mZ3I4NyIsImEiOiJja2N4NHRhamMwMmltMzBvcG95aWdsemFqIn0.f_RXemAOG-ptjBUQc7H5uA';
      this._map = new Map({
        container: divMap,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [-2.508389, 36.963916],
        zoom: 15.8,
        scrollZoom: true,
        attributionControl: false,
      });

      this.loading = true;
      this.shareMapToServices();
      this.loading = false;

    } catch (error) {
      console.log("Error al cargar el mapa");
    }
  }

  shareMapToServices() {
    this._mapService.map = this._map;
    this._unitGenericService.map = this._map;
    this._unitHydrantService.map = this._map;
    this._unitPondService.map = this._map;
    this._stationService.map = this._map;
  }

}