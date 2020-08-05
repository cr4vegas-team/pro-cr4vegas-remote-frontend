import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapService } from '../../../services/map.service';
import { HydrantService } from '../../../services/hydrant.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy {

  constructor(
    private _mapService: MapService,
    private _hydrantService: HydrantService,
  ) { }

  ngOnInit(): void {
    this._mapService.createAndLoadMap(document.getElementById('map'));
    this._hydrantService.load();
  }

  ngOnDestroy(): void {
    this._mapService.removeMap();
  }
}