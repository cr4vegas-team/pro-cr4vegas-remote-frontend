import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Marker } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MqttEventsService } from '../mqtt-events.service';
import { UnitHydrantEntity } from '../../models/unit-hydrant.entity';
import { AuthService } from './auth.service';
import { GLOBAL } from '../../constants/global.constant';
import { Map } from 'mapbox-gl';
import { MapService } from '../map.service';
import { DialogUnitHydrantComponent } from 'src/app/components/shared/dialog-unit-hydrant/dialog-unit-hydrant.component';
import { TopicTypeEnum } from '../../constants/topic-type.enum';
import { MarkerColourEnum } from '../../constants/marker-colour.enum';
import { BouyState } from 'src/app/constants/bouy-state.enum';
import { UnitTypeEnum } from 'src/app/constants/unit-type.enum';

@Injectable({
  providedIn: 'root',
})
export class UnitHydrantService {

  private _url: string = GLOBAL.API + 'unit-hydrant';

  private _unitsHydrants: BehaviorSubject<UnitHydrantEntity[]>;
  private _map: Map;

  constructor(
    private readonly _mqttEventsService: MqttEventsService,
    private readonly _dialog: MatDialog,
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _mapService: MapService,
  ) {
    this._unitsHydrants = new BehaviorSubject<UnitHydrantEntity[]>(Array<UnitHydrantEntity>());
    this._mapService.getMapObservable().subscribe(
      next => {
        if (next) {
          this._map = next;
          this.getHydrants();
        }
      }
    )
  }

  subscribeToHydrants(): Observable<UnitHydrantEntity[]> {
    return this._unitsHydrants;
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================
  async getHydrants() {
    await this._httpClient.get(this._url, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        this._unitsHydrants.value.forEach(unitHydrant => {
          this.removeMarkerAndUnsubscribeMQTTTopicToUnitHydrant(unitHydrant);
        });
        this._unitsHydrants.value.splice(0);
        (res as any).unitsHydrants.forEach((unitHydrant: UnitHydrantEntity) => {
          this._unitsHydrants.value.push(unitHydrant);
          this.addMarkerAndSubscribeMQTTTopicToUnitHydrant(unitHydrant);
        });
        this._unitsHydrants.next(this._unitsHydrants.value);
      },
      err => {
        this._unitsHydrants.error(err);
      }
    );
    /*     let change: boolean = false;
        setInterval(() => {
          if (change) {
            this.setMarker(this._unitsHydrants.value[0], MarkerTypeEnum.ALARM);
            this.setMarker(this._unitsHydrants.value[1], MarkerTypeEnum.ALARM);
            this.setMarker(this._unitsHydrants.value[2], MarkerTypeEnum.ALARM);
            change = false;
          } else {
            this.setMarker(this._unitsHydrants.value[0], MarkerTypeEnum.WARNING);
            this.setMarker(this._unitsHydrants.value[1], MarkerTypeEnum.WARNING);
            this.setMarker(this._unitsHydrants.value[2], MarkerTypeEnum.WARNING);
            change = true;
          }
    
        }, 100); */
  }

  getHydrant(code: string) {
    this._httpClient.get(this._url + `/?${code}`, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        this._unitsHydrants.value.push(res as any);
        this._unitsHydrants.next(this._unitsHydrants.value);
      },
      err => {
        this._unitsHydrants.error(err);
      }
    );
  }

  addHydrant(unitHydrant: UnitHydrantEntity) {
    this._httpClient.post(this._url, unitHydrant, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        const newUnitHydrant: UnitHydrantEntity = (res as any);
        this.addMarkerAndSubscribeMQTTTopicToUnitHydrant(newUnitHydrant);
        this._unitsHydrants.value.push(newUnitHydrant);
        this._unitsHydrants.next(this._unitsHydrants.value);
      },
      err => {
        this._unitsHydrants.error(err);
      }
    )
  }

  removeHydrant(code: string) {
    this._httpClient.delete(this._url + `/${code}`, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        if (res) {
          let unitHydrant: UnitHydrantEntity = this._unitsHydrants.value.filter(unitHydrant => unitHydrant.code = code)[0];
          if (unitHydrant) {
            unitHydrant.unit.active = 0;
            this.removeMarkerAndUnsubscribeMQTTTopicToUnitHydrant(unitHydrant);
            this._unitsHydrants.next(this._unitsHydrants.value);
          }
        }
      },
      err => {
        this._unitsHydrants.error(err);
      }
    )
  }

  async activeHydrant(code: string) {
    await this._httpClient.patch(this._url + `/${code}`, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        if (res) {
          let unitHydrant: UnitHydrantEntity = this._unitsHydrants.value.filter(unitHydrant => unitHydrant.code = code)[0];
          if (unitHydrant) {
            unitHydrant.unit.active = 1;
            this.addMarkerAndSubscribeMQTTTopicToUnitHydrant(unitHydrant);
            this._unitsHydrants.next(this._unitsHydrants.value);
          }
        }
      },
      err => {
        this._unitsHydrants.error(err);
      }
    )
  }

  modifyHydrant(code: string, updateHydrant: UnitHydrantEntity) {
    this._httpClient.put(this._url + `/?${code}`, updateHydrant, { headers: this._authService.loadAccessToken() }).subscribe(
      res => {
        if (res) {
          let unitHydrant: UnitHydrantEntity = this._unitsHydrants.value.filter(unitHydrant => unitHydrant.code = code)[0];
          if (unitHydrant) {
            unitHydrant.code = updateHydrant.code;
            unitHydrant.filter = updateHydrant.filter;
            unitHydrant.diameter = updateHydrant.diameter;
            unitHydrant.unit = updateHydrant.unit;
            this.unsubscribe(unitHydrant);
            this.subscribe(unitHydrant);
          }
        }
      },
      err => {
        this._unitsHydrants.error(err);
      }
    )
  }

  // ==================================================
  // Marker & MQTT
  // ==================================================

  addMarkersAndSubscribeMQTTAll() {
    this._unitsHydrants.value.forEach(hydrant => {
      this.addMarkerAndSubscribeMQTTTopicToUnitHydrant(hydrant);
    });
    this._unitsHydrants.next(this._unitsHydrants.value);
  }

  private addMarkerAndSubscribeMQTTTopicToUnitHydrant(unitHydrant: UnitHydrantEntity) {
    this.removeAndAddMarker(unitHydrant);
    this.setAnimationAccordingState(unitHydrant);
    this.subscribe(unitHydrant);
  }

  private removeAndAddMarker(unitHydrant: UnitHydrantEntity) {
    if (unitHydrant.marker) {
      unitHydrant.marker.remove();
    }
    unitHydrant.marker = new Marker({
      color: this.getMarkerColourAccordingBouyState(unitHydrant),
    });
    unitHydrant.marker.setLngLat([unitHydrant.unit.longitude, unitHydrant.unit.latitude]);
    unitHydrant.marker.addTo(this._map);
    unitHydrant.marker.getElement().onclick = () => this._dialog.open(DialogUnitHydrantComponent, { data: unitHydrant, width: '70%' });
    this.setAnimationAccordingState(unitHydrant);
  }

  private getMarkerColourAccordingBouyState(unitHydrant: UnitHydrantEntity): MarkerColourEnum {
    if (unitHydrant.bouyState) {
      if (unitHydrant.bouyState === BouyState.LOW) {
        return MarkerColourEnum.UNIT_HYDRANT_LOW;
      }
      if (unitHydrant.bouyState === BouyState.MEDIUM) {
        return MarkerColourEnum.UNIT_HYDRANT_MEDIUM;
      }
      if (unitHydrant.bouyState === BouyState.HIGTH) {
        return MarkerColourEnum.UNIT_HYDRANT_HIGTH;
      }
      if (unitHydrant.bouyState === BouyState.ALARM) {
        return MarkerColourEnum.ALARM;
      }
    } else {
      return MarkerColourEnum.UNIT_HYDRANT_LOW;
    }
  }

  removeMarkersAndUnsubscribeMQTTAll() {
    this._unitsHydrants.value.forEach(hydrant => {
      this.removeMarkerAndUnsubscribeMQTTTopicToUnitHydrant(hydrant);
    });
    this._unitsHydrants.next(this._unitsHydrants.value);
  }

  private removeMarkerAndUnsubscribeMQTTTopicToUnitHydrant(unitHydrant: UnitHydrantEntity) {
    unitHydrant.marker.remove();
    this.unsubscribe(unitHydrant);
  }

  // ==================================================
  // MQTT
  // ==================================================

  private subscribe(unitHydrant: UnitHydrantEntity) {
    if (unitHydrant) {
      let subscription: Subscription = this._mqttEventsService.subscribe(TopicTypeEnum.UNIT_HYDRANT, unitHydrant.code).subscribe(
        (data: IMqttMessage) => {
          let dataSplit: string[] = data.payload.toString().split(',');
          if (dataSplit[0]) {
            console.log(unitHydrant);
            unitHydrant.valve = dataSplit[0] === '0' ? false : true;
            this.setAnimationAccordingState(unitHydrant);
          }
          if (dataSplit[1]) {
            unitHydrant.flow = Number.parseFloat(dataSplit[1]);
          }
          if (dataSplit[2]) {
            unitHydrant.bouyLow = dataSplit[2] === '0' ? false : true;
          }
          if (dataSplit[3]) {
            unitHydrant.bouyMedium = dataSplit[3] === '0' ? false : true;
          }
          if (dataSplit[4]) {
            unitHydrant.bouyHight = dataSplit[4] === '0' ? false : true;
          }
          if (dataSplit[5]) {
            unitHydrant.temperature = Number.parseFloat(dataSplit[5]);
          }
          if (dataSplit[6]) {
            unitHydrant.humidity = Number.parseInt(dataSplit[6]);
          }
          this.checkBouysState(unitHydrant);
          this.checkBouysWarnings(unitHydrant);
        },
        err => {
          console.log(err);
        },
        () => {
          console.log(unitHydrant + ': subcription completed');
        }
      );
      unitHydrant.subscription = subscription;
    }
  }

  private checkBouysState(hydrant: UnitHydrantEntity) {
    let bouysState: BouyState = null;
    if (!hydrant.bouyLow) {
      bouysState = BouyState.LOW;
    }
    if (hydrant.bouyLow) {
      bouysState = BouyState.MEDIUM;
    }
    if (hydrant.bouyMedium) {
      bouysState = BouyState.HIGTH;
    }
    if (hydrant.bouyHight) {
      bouysState = BouyState.ALARM;
    }
    if (hydrant.bouyState !== bouysState) {
      hydrant.bouyState = bouysState;
      this.removeAndAddMarker(hydrant);
    }
  }

  private checkBouysWarnings(hydrant: UnitHydrantEntity) {
    let bouysWarnings: string = '';
    if (!hydrant.bouyLow && hydrant.bouyMedium) {
      bouysWarnings = 'Comprobar las boyas baja y media. ';
    }
    if (!hydrant.bouyLow && !hydrant.bouyMedium && hydrant.bouyHight) {
      bouysWarnings = 'Comprobar las boyas media y alta. ';
    }
    if ((hydrant.bouyLow && hydrant.bouyMedium && !hydrant.bouyHight) ||
      (!hydrant.bouyLow && hydrant.bouyMedium && !hydrant.bouyHight)) {
      bouysWarnings = `
          ${bouysWarnings}
          En el estado "${hydrant.bouyState}" deberías tomar precaución. 
          La boya de Alarma de nivel solo se puede comprobar físicamente`;
    }
    hydrant.bouyWarning = bouysWarnings;
  }

  unsubscribe(hydrant: UnitHydrantEntity) {
    if (hydrant) {
      if (hydrant.subscription) {
        hydrant.subscription.unsubscribe();
      }
    }
  }

  private setAnimationAccordingState(unitHydrant: UnitHydrantEntity) {
    if (unitHydrant.valve) {
      unitHydrant.marker.getElement().style.animation = 'fade 0.5s 0.5s infinite linear both';
      if (unitHydrant.bouyState === BouyState.ALARM) {
        unitHydrant.marker.getElement().style.boxShadow = '0px -5px 10px 10px rgba(255,0,0,0.5) inset, 0px -5px 10px 5px rgba(255,0,0,0.7)';
      } else {
        unitHydrant.marker.getElement().style.boxShadow = '0px -5px 10px 10px rgba(0,255,0,0.5) inset, 0px -5px 10px 5px rgba(0,255,0,0.7)';
      }
      unitHydrant.marker.getElement().style.borderRadius = '50%';
    } else {
      unitHydrant.marker.getElement().style.animation = '';
      unitHydrant.marker.getElement().style.boxShadow = '';
    }
  }

}
