import { Injectable } from '@angular/core';
import { IMqttMessage } from 'ngx-mqtt';
import { UnitGenericEntity } from 'src/app/modules/unit/unit-generic/unit-generic.entity';
import { MQTTTopics } from './../../../shared/constants/mqtt-topics.enum';
import { MqttEventService } from './../../../shared/services/mqtt-event.service';

@Injectable({
  providedIn: 'root',
})
export class UnitGenericMqttService {
  private _testCommunication: boolean = false;

  constructor(private readonly _mqttEventService: MqttEventService) {}

  // ==================================================
  //  PUBLISH
  // ==================================================
  public publishGETCommunication(unitGeneric: UnitGenericEntity): void {
    this._mqttEventService.unsafePublish(
      MQTTTopics.PUBLISH_UNIT_GENERIC +
      (unitGeneric.unit.sector ? unitGeneric.unit.sector.code.toLowerCase() : 'na') + '/' +
      unitGeneric.unit.code,
      `1`
    );
  }

  public publishGETData(unitGeneric: UnitGenericEntity): void {
    this._mqttEventService.unsafePublish(
      MQTTTopics.PUBLISH_UNIT_GENERIC +
      (unitGeneric.unit.sector ? unitGeneric.unit.sector.code.toLowerCase() : 'na') + '/' +
      unitGeneric.unit.code,
      `2`
    );
  }

  public publishGETSIMData(unitGeneric: UnitGenericEntity): void {
    this._mqttEventService.unsafePublish(
      MQTTTopics.PUBLISH_UNIT_GENERIC +
      (unitGeneric.unit.sector ? unitGeneric.unit.sector.code.toLowerCase() : 'na') + '/' +
      unitGeneric.unit.code,
      `3`
    );
  }

  public publishSendSpeed(
    unitGeneric: UnitGenericEntity,
    sendSpeed: number
  ): void {
    this._mqttEventService.unsafePublish(
      MQTTTopics.PUBLISH_UNIT_GENERIC +
      (unitGeneric.unit.sector ? unitGeneric.unit.sector.code.toLowerCase() : 'na') + '/' +
      unitGeneric.unit.code,
      `8,${sendSpeed}`
    );
  }

  public publishConfiguration(
    unitGeneric: UnitGenericEntity,
    reading: number
  ): void {
    this._mqttEventService.unsafePublish(
      MQTTTopics.PUBLISH_UNIT_GENERIC +
      (unitGeneric.unit.sector ? unitGeneric.unit.sector.code.toLowerCase() : 'na') + '/' +
      unitGeneric.unit.code,
      `9,${reading}`
    );
  }

  // ==================================================
  //  SUBSCRIPTIONS
  // ==================================================
  public subscribeToMQTT(unitGeneric: UnitGenericEntity) {
    this.subscribeToNodeTopics(unitGeneric);
  }

  private subscribeToNodeTopics(unitGeneric: UnitGenericEntity) {
    unitGeneric.mqttNodeSubscription = this._mqttEventService
      .observe(
        MQTTTopics.OBSERVE_UNIT_GENERIC +
        (unitGeneric.unit.sector ? unitGeneric.unit.sector.code.toLowerCase() : 'na') + '/' +
        unitGeneric.unit.code
      )
      .subscribe((mqttMSG: IMqttMessage) => {
        this.updateProperties(unitGeneric, mqttMSG.payload.toString());
      });
  }

  public updateProperties(
    unitGeneric: UnitGenericEntity,
    topicMessage: string
  ): void {
    const dataSplit: string[] = topicMessage.split(',');
    if (dataSplit.length > 0) {
      switch (dataSplit[0]) {
        case '0':
          unitGeneric.unit.communication = 0;
          break;
        case '1':
          unitGeneric.unit.communication = 1;
          break;
        case '2':
          if (dataSplit[1]) {
            unitGeneric.property1$.next(Number.parseFloat(dataSplit[1]));
          }
          if (dataSplit[2]) {
            unitGeneric.property1$.next(Number.parseFloat(dataSplit[2]));
          }
          if (dataSplit[3]) {
            unitGeneric.property1$.next(Number.parseFloat(dataSplit[3]));
          }
          if (dataSplit[4]) {
            unitGeneric.property1$.next(Number.parseFloat(dataSplit[4]));
          }
          if (dataSplit[5]) {
            unitGeneric.property1$.next(Number.parseFloat(dataSplit[5]));
          }
          break;
        case '3':
          if (dataSplit[1]) {
            unitGeneric.unit.operator = dataSplit[1];
          }
          if (dataSplit[2]) {
            unitGeneric.unit.signal = Number.parseFloat(dataSplit[1]);
          }
          if (dataSplit[3]) {
            unitGeneric.unit.ip = dataSplit[1];
          }
          break;
        default:
      }
    }
    unitGeneric.checkStatus();
  }
}
