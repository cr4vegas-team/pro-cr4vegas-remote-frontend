import { Injectable } from '@angular/core';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { WSEndPoints } from 'src/app/shared/constants/ws-endpoints.enum';
import { MQTTPacket } from 'src/app/shared/models/mqtt-packet.model';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { MQTTTopics } from './../../../shared/constants/mqtt-topics.enum';
import { UnitHydrantWSDto } from './dto/unit-hydrant-ws.dto';
import { UnitHydrantEntity } from './unit-hydrant.entity';

@Injectable({
  providedIn: 'root',
})
export class UnitHydrantSocketService {
  constructor(
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _webSocketService: WebsocketService
  ) {
    this._webSocketService.subscribeReceived().subscribe((received) => {
      if (received) {
        console.log(received);
        const event = received.event;
        const data = JSON.parse(received.data);
        if (event == WSEndPoints.RECEIVE_CREATE_UNIT_HYDRANT) {
          this._unitHydrantService.createWS(data);
        }
        if (event == WSEndPoints.RECEIVE_UPDATE_UNIT_HYDRANT) {
          this._unitHydrantService.updateWS(data);
        }
        if (event == WSEndPoints.RECEIVE_UNIT_HYDRANT) {
          const mqttPacket = new MQTTPacket();
          mqttPacket.topic = data.topic;
          mqttPacket.message = data.message;
          this._unitHydrantService.extractMQTTPacketAndAct(mqttPacket);
        }
      }
    });
  }

  public sendPacketMQTT(unitHydrant: UnitHydrantEntity, message: string): void {
    const topic = MQTTTopics.UNIT_POND + unitHydrant.id;
    const packet = JSON.stringify({
      topic,
      message,
    });
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_UNIT_HYDRANT,
        data: packet,
      })
    );
  }

  public sendCreate(unitHydrant: UnitHydrantWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_CREATE_UNIT_HYDRANT,
        data: JSON.stringify(unitHydrant),
      })
    );
  }

  public sendUpdate(unitHydrant: UnitHydrantWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_UPDATE_UNIT_HYDRANT,
        data: JSON.stringify(unitHydrant),
      })
    );
  }
}
