import { Injectable } from '@angular/core';
import { IMqttMessage } from 'ngx-mqtt';
import { MQTTTopics } from 'src/app/shared/constants/mqtt-topics.enum';
import { MqttEventService } from './../../../shared/services/mqtt-event.service';
import { UnitPondEntity } from './unit-pond.entity';

@Injectable({
  providedIn: 'root'
})
export class UnitPondMqttService {

  constructor(private readonly _mqttEventService: MqttEventService) { }

  // ==================================================
  //  PUBLISH
  // ==================================================
  public publishGETCommunication(unitPond: UnitPondEntity): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_POND + unitPond.id, `1`);
  }

  public publishGETData(unitPond: UnitPondEntity): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_POND + unitPond.id, `2`)
  }

  public publishGETSIMData(unitPond: UnitPondEntity): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_POND + unitPond.id, `3`)
  }

  public publishOrders(unitPond: UnitPondEntity, electrovalvula: number): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_POND + unitPond.id, `5,${electrovalvula}`);
  }

  public publishSendSpeed(unitPond: UnitPondEntity, sendSpeed: number): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_POND + unitPond.id, `8,${sendSpeed}`);
  }

  public publishConfiguration(unitPond: UnitPondEntity, reading: number): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_POND + unitPond.id, `9,${reading}`);
  }

  // ==================================================
  //  SUBSCRIPTIONS
  // ==================================================
  public subscribeMQTT(unitPond: UnitPondEntity) {
    unitPond.mqttSubscription = this._mqttEventService.observe(MQTTTopics.OBSERVE_UNIT_HYDRANT + unitPond.id).subscribe((mqttMSG: IMqttMessage) => {
      this.updateProperties(unitPond, mqttMSG.payload.toString());
    });
  }

  public updateProperties(
    unitPond: UnitPondEntity,
    topicMessage: string
  ): void {
    const dataSplit: string[] = topicMessage.split(',');
    if (dataSplit.length > 0) {
      switch (dataSplit[0]) {
        case '0':
          unitPond.unit.communication = 0;
          break;
        case '1':
          unitPond.unit.communication = 1;
          break;
        case '2':
          if (dataSplit[1]) {
            unitPond.level$.next(Number.parseInt(dataSplit[1]));
          }
          break;
        case '3':
          if (dataSplit[1]) {
            unitPond.unit.operator = dataSplit[1];
          }
          if (dataSplit[2]) {
            unitPond.unit.signal = Number.parseFloat(dataSplit[1]);
          }
          if (dataSplit[3]) {
            unitPond.unit.ip = dataSplit[1];
          }
          break;
        default:
      }
    }
    unitPond.checkStatus();
  }
}
