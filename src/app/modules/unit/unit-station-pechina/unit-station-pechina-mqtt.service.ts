import { Injectable } from '@angular/core';
import { IMqttMessage } from 'ngx-mqtt';
import { MQTTTopics } from 'src/app/shared/constants/mqtt-topics.enum';
import { MqttEventService } from 'src/app/shared/services/mqtt-event.service';
import { UnitStationPechinaEntity } from './unit-station-pechina.entity';

@Injectable({
  providedIn: 'root'
})
export class UnitStationPechinaMqttService {

  constructor(
    private readonly _mqttEventService: MqttEventService,
  ) { }

  // ==================================================
  //  PUBLISH
  // ==================================================
  public publishGETCommunication(unitStationPechina: UnitStationPechinaEntity): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_STATION_PECHINA
      + unitStationPechina.unit.code, `1`);
  }

  public publishGETData(unitStationPechina: UnitStationPechinaEntity): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_STATION_PECHINA
      + unitStationPechina.unit.code, `2`);
  }

  public publishGETSIMData(unitStationPechina: UnitStationPechinaEntity): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_STATION_PECHINA
      + unitStationPechina.unit.code, `3`);
  }

  public publishOrders(unitStationPechina: UnitStationPechinaEntity, electrovalvula: number): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_STATION_PECHINA
      + unitStationPechina.unit.code, `5,${electrovalvula}`);
  }

  public publishSendSpeed(unitStationPechina: UnitStationPechinaEntity, sendSpeed: number): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_STATION_PECHINA
      + unitStationPechina.unit.code, `8,${sendSpeed}`);
  }

  public publishConfiguration(unitStationPechina: UnitStationPechinaEntity, reading: number): void {
    this._mqttEventService.unsafePublish(MQTTTopics.PUBLISH_UNIT_STATION_PECHINA
      + unitStationPechina.unit.code, `9,${reading}`);
  }

  // ==================================================
  //  SUBSCRIPTIONS
  // ==================================================
  public subscribeMQTT(unitStationPechina: UnitStationPechinaEntity): void {
    unitStationPechina.mqttSubscription = this._mqttEventService.observe(MQTTTopics.OBSERVE_UNIT_STATION_PECHINA
      + unitStationPechina.unit.code).subscribe((mqttMSG: IMqttMessage) => {
        console.log(mqttMSG.payload);
        this.updateProperties(unitStationPechina, mqttMSG.payload.toString());
      });
  }

  public updateProperties(unitStationPechina: UnitStationPechinaEntity, topicMessage: string): void {
    const dataSplit: string[] = topicMessage.toString().split(',');
    if (dataSplit.length > 0) {
      switch (dataSplit[0]) {
        case '0':
          unitStationPechina.unit.communication = 0;
          break;
        case '1':
          unitStationPechina.unit.communication = 1;
          break;
        case '2':
          unitStationPechina.unit.communication = 1;
          if (dataSplit[1]) {
            unitStationPechina.reading$.next(Number.parseInt(dataSplit[1], 10));
          }
          if (dataSplit[2] && dataSplit[2] !== '') {
            unitStationPechina.flow$.next(Number.parseInt(dataSplit[2], 10));
          }
          if (dataSplit[3] && dataSplit[3] !== '') {
            unitStationPechina.flow$.next(Number.parseFloat(dataSplit[3]));
          }
          break;
        case '3':
          unitStationPechina.unit.communication = 1;
          if (dataSplit[1]) {
            unitStationPechina.unit.operator = dataSplit[1];
          }
          if (dataSplit[2]) {
            unitStationPechina.unit.signal = Number.parseFloat(dataSplit[1]);
          }
          if (dataSplit[3]) {
            unitStationPechina.unit.ip = dataSplit[1];
          }
          break;
        default:
      }
    }
    unitStationPechina.checkStatus();
  }
}
