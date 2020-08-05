import { Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Map, Marker } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { DialogHydrantComponent } from '../components/shared/dialog-hydrant/dialog-hydrant.component';
import { HYDRANTS_TEST } from '../data-test/hydrants';
import { Hydrant } from '../models/hydrant';
import { MqttEventsService } from '../services/mqtt-events.service';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class HydrantService {

  private _hydrants: Hydrant[];
  private _map: Map;

  constructor(
    private readonly _mqttEventsService: MqttEventsService,
    private readonly _mapService: MapService,
    private _dialog: MatDialog
  ) { }

  load() {
    this._hydrants = HYDRANTS_TEST;
    this._map = this._mapService.getMap();
    this.addMarkersAndSubscribeMQTTTopicAndAddToMapHydrants();
  }

  private addMarkersAndSubscribeMQTTTopicAndAddToMapHydrants() {
    for (let hydrant of this._hydrants) {
      this.addMarker(hydrant);
      this.subscribe(hydrant);
    }
  }

  getHydrant(code: string): Hydrant {
    let hydrant: Hydrant = this._hydrants.filter(h => h.code === code)[0];
    if (hydrant) return hydrant;
    return null;
  }

  addHydrant(hydrant: Hydrant) {
    if (hydrant) {
      this._hydrants.push(hydrant);
    }
  }

  removeHydrant(code: string) {
    this._hydrants = this._hydrants.filter(hydrant => hydrant.code !== code);
  }

  modifyHydrant(code: string, updateHydrant: Hydrant) {
    let hydrant: Hydrant = this._hydrants.filter(h => h.code === code)[0];
    hydrant.altitude = updateHydrant.altitude;
    hydrant.longitude = updateHydrant.longitude;
    hydrant.latitude = updateHydrant.latitude;
    hydrant.color = updateHydrant.color;
    hydrant.code = updateHydrant.code;
    hydrant.sector = updateHydrant.sector;
    hydrant.img = updateHydrant.img;
  }

  addMarker(hydrant: Hydrant) {
    if (hydrant.marker) {
      hydrant.marker.remove();
    }
    hydrant.marker = new Marker({
      draggable: true,
      color: hydrant.color,
    })
      .setLngLat([hydrant.longitude, hydrant.latitude])
      .addTo(this._map);

    hydrant.marker.getElement().onclick = () => this._dialog.open(DialogHydrantComponent, { data: hydrant, width: 'fit-content' });
    hydrant.marker.getElement().style.animation = 'fade 0.5s 0.5s infinite linear';
  }

  subscribe(hydrant: Hydrant) {
    if (hydrant) {
      let subscription: Subscription = this._mqttEventsService.subscribe(hydrant.code).subscribe((data: IMqttMessage) => {
        let dataSplit: string[] = data.payload.toString().split(',');
        if (dataSplit[0]) {
          hydrant.valve = dataSplit[0] === '0' ? false : true;
        }
        if (dataSplit[1]) {
          hydrant.flow = Number.parseFloat(dataSplit[1]);
        }
        if (dataSplit[2]) {
          hydrant.bouyLow = dataSplit[2] === '0' ? false : true;
        }
        if (dataSplit[3]) {
          hydrant.bouyMedium = dataSplit[3] === '0' ? false : true;
        }
        if (dataSplit[4]) {
          hydrant.bouyHight = dataSplit[4] === '0' ? false : true;
        }
        if (dataSplit[5]) {
          hydrant.temperature = Number.parseFloat(dataSplit[5]);
        }
        if (dataSplit[6]) {
          hydrant.humidity = Number.parseInt(dataSplit[6]);
        }
        this.checkBouysState(hydrant);
      });
      hydrant.subscription = subscription;
    }
  }

  private checkBouysState(hydrant: Hydrant) {

  }

  unsubscribe(hydrant: Hydrant) {
    if (hydrant) {
      if (hydrant.subscription) {
        hydrant.subscription.unsubscribe();
      }
    }
  }

}
