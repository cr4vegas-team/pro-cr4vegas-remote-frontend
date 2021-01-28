import { Injectable, OnDestroy } from '@angular/core';
import { IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { MQTTTopics } from 'src/app/shared/constants/mqtt-topics.enum';
import { MqttEventService } from 'src/app/shared/services/mqtt-event.service';
import { UnitGenericService } from '../unit-generic/unit-generic.service';
import { UnitHydrantService } from '../unit-hydrant/unit-hydrant.service';
import { UnitPondService } from '../unit-pond/unit-pond.service';
import { UnitStationPechinaService } from '../unit-station-pechina/unit-station-pechina.service';

@Injectable({
  providedIn: 'root',
})
export class UnitMqttService implements OnDestroy {
  private _serverSubscription: Subscription;

  constructor(
    private readonly _mqttEventService: MqttEventService,
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _unitGenericService: UnitGenericService,
    private readonly _unitPondService: UnitPondService,
    private readonly _unitStationPechinaService: UnitStationPechinaService
  ) {}

  subscribeToServerTopic(): void {
    this._serverSubscription = this._mqttEventService
      .observe(MQTTTopics.OBSERVER_SERVER_TEST_COMMUNICATION)
      .subscribe((mqttMSG: IMqttMessage) => {
        this._unitHydrantService
          .getUnitsHydrants()
          .value.forEach((unitHydrant) => {
            unitHydrant.unit.received = 0;
          });
        this._unitGenericService
          .getUnitsGeneric()
          .value.forEach((unitGeneric) => {
            unitGeneric.unit.received = 0;
          });
        this._unitPondService.getUnitsPonds().value.forEach((unitPond) => {
          unitPond.unit.received = 0;
        });
        this._unitStationPechinaService.getUnitStationPechina().value.unit.received = 0;
        this.checkIfMessageReceivedFromNodes();
      });
  }

  private checkIfMessageReceivedFromNodes(): void {
    // ----------------------------
    //  Wait over 60 seconds to check if message received from nodes
    // ----------------------------
    setTimeout(() => {
      // Hydrants
      this._unitHydrantService
        .getUnitsHydrants()
        .value.forEach((unitHydrant) => {
          if (unitHydrant.unit.received === 1) {
            if (unitHydrant.unit.communication === 0) {
              unitHydrant.unit.communication = 1;
              unitHydrant.checkStatus();
            }
          } else {
            if (unitHydrant.unit.communication === 1) {
              unitHydrant.unit.communication = 0;
              unitHydrant.checkStatus();
            }
          }
          this._unitHydrantService.refresh();
        });
      // Generics
      this._unitGenericService
        .getUnitsGeneric()
        .value.forEach((unitGeneric) => {
          if (unitGeneric.unit.received === 1) {
            if (unitGeneric.unit.communication === 0) {
              unitGeneric.unit.communication = 1;
              unitGeneric.checkStatus();
            }
          } else {
            if (unitGeneric.unit.communication == 1) {
              unitGeneric.unit.communication = 0;
              unitGeneric.checkStatus();
            }
          }
        });
      // Ponds
      this._unitPondService.getUnitsPonds().value.forEach((unitPond) => {
        if (unitPond.unit.received === 1) {
          if (unitPond.unit.communication == 0) {
            unitPond.unit.communication = 1;
            unitPond.checkStatus();
          }
        } else {
          if (unitPond.unit.communication === 1) {
            unitPond.unit.communication = 0;
            unitPond.checkStatus();
          }
        }
      });
      // Station Pechina
      const stationPechina = this._unitStationPechinaService.getUnitStationPechina()
        .value;
      if (stationPechina.unit.received === 1) {
        stationPechina.unit.communication = 1;
        stationPechina.checkStatus();
      } else {
        stationPechina.unit.communication = 0;
        stationPechina.checkStatus();
      }
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this._serverSubscription) {
      this._serverSubscription.unsubscribe();
    }
  }
}
