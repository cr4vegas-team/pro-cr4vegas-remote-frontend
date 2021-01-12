import { Injectable } from '@angular/core';
import { IMqttMessage } from 'ngx-mqtt';
import { UnitHydrantEntity } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.entity';
import { MQTTTopics } from 'src/app/shared/constants/mqtt-topics.enum';
import { MqttEventService } from 'src/app/shared/services/mqtt-event.service';

@Injectable({
  providedIn: 'root'
})
export class UnitHydrantMqttService {

  constructor(
    private readonly _mqttEventService: MqttEventService,
  ) { }

  // ==================================================
  //  PUBLISH
  // ==================================================
  public publishGETCommunication(unitHydrant: UnitHydrantEntity): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_HYDRANT + unitHydrant.unit.sector.code.toLowerCase() + '/' + unitHydrant.id, `1`);
  }

  public publishGETData(unitHydrant: UnitHydrantEntity): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_HYDRANT + unitHydrant.unit.sector.code.toLowerCase() + '/' + unitHydrant.id, `2`);
  }

  public publishGETSIMData(unitHydrant: UnitHydrantEntity): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_HYDRANT + unitHydrant.unit.sector.code.toLowerCase() + '/' + unitHydrant.id, `3`);
  }

  public publishOrders(unitHydrant: UnitHydrantEntity, electrovalvula: number): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_HYDRANT + unitHydrant.unit.sector.code.toLowerCase() + '/' + unitHydrant.id, `5,${electrovalvula}`);
  }

  public publishSendSpeed(unitHydrant: UnitHydrantEntity, sendSpeed: number): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_HYDRANT + unitHydrant.unit.sector.code.toLowerCase() + '/' + unitHydrant.id, `8,${sendSpeed}`);
  }

  public publishConfiguration(unitHydrant: UnitHydrantEntity, reading: number): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_HYDRANT + unitHydrant.unit.sector.code.toLowerCase() + '/' + unitHydrant.id, `9,${reading}`);
  }

  // ==================================================
  //  SUBSCRIPTIONS
  // ==================================================
  public subscribeMQTT(unitHydrant: UnitHydrantEntity): void {
    unitHydrant.mqttSubscription = this._mqttEventService.observe(MQTTTopics.OBSERVE_UNIT_HYDRANT +
      unitHydrant.unit.sector.code.toLowerCase() + '/' + unitHydrant.id).subscribe((mqttMSG: IMqttMessage) => {
        console.log(mqttMSG.payload.toString());
        this.updateProperties(unitHydrant, mqttMSG.payload.toString());
      });
  }

  public updateProperties(unitHydrant: UnitHydrantEntity, topicMessage: string): void {
    const dataSplit: string[] = topicMessage.toString().split(',');
    if (dataSplit.length > 0) {
      switch (dataSplit[0]) {
        case '0':
          unitHydrant.unit.communication = 0;
          break;
        case '1':
          unitHydrant.unit.communication = 1;
          break;
        case '2':
          unitHydrant.unit.communication = 1;
          if (dataSplit[1]) {
            unitHydrant.valve$.next(Number.parseInt(dataSplit[1], 10));
          }
          if (dataSplit[2] && dataSplit[2] !== '') {
            unitHydrant.reading$.next(Number.parseInt(dataSplit[2], 10));
          }
          if (dataSplit[3] && dataSplit[3] !== '') {
            unitHydrant.flow$.next(Number.parseFloat(dataSplit[3]));
          }
          if (dataSplit[4]) {
            unitHydrant.bouyLow$.next(Number.parseFloat(dataSplit[4]));
          }
          if (dataSplit[5]) {
            unitHydrant.bouyMedium$.next(Number.parseFloat(dataSplit[5]));
          }
          if (dataSplit[6]) {
            unitHydrant.bouyHight$.next(Number.parseFloat(dataSplit[6]));
          }
          if (dataSplit[7]) {
            unitHydrant.pressure$.next(Number.parseFloat(dataSplit[7]));
          }
          break;
        case '3':
          unitHydrant.unit.communication = 1;
          if (dataSplit[1]) {
            unitHydrant.unit.operator = dataSplit[1];
          }
          if (dataSplit[2]) {
            unitHydrant.unit.signal = Number.parseFloat(dataSplit[1]);
          }
          if (dataSplit[3]) {
            unitHydrant.unit.ip = dataSplit[1];
          }
          break;
        default:
      }
    }
    unitHydrant.checkStatus();
  }
}
