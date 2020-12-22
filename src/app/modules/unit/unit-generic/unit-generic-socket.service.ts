import { Injectable } from '@angular/core';
import { WSEndPoints } from 'src/app/shared/constants/ws-endpoints.enum';
import { MQTTPacket } from 'src/app/shared/models/mqtt-packet.model';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { MQTTTopics } from './../../../shared/constants/mqtt-topics.enum';
import { UnitGenericWSDto } from './dto/unit-generic-ws.dto';
import { UnitGenericEntity } from './unit-generic.entity';
import { UnitGenericService } from './unit-generic.service';

@Injectable({
  providedIn: 'root',
})
export class UnitGenericSocketService {
  constructor(
    private readonly _unitGenericService: UnitGenericService,
    private readonly _webSocketService: WebsocketService
  ) {
    this._webSocketService.subscribeReceived().subscribe((received) => {
      if (received) {
        const event = received.event;
        const data = JSON.parse(received.data);
        if (event == WSEndPoints.RECEIVE_CREATE_UNIT_GENERIC) {
          this._unitGenericService.createWS(data);
        }
        if (event == WSEndPoints.RECEIVE_UPDATE_UNIT_GENERIC) {
          this._unitGenericService.updateWS(data);
        }
        if (event == WSEndPoints.RECEIVE_UNIT_GENERIC) {
          const mqttPacket = new MQTTPacket();
          mqttPacket.topic = data.topic;
          mqttPacket.message = data.message;
          this._unitGenericService.extractMQTTPacketAndAct(mqttPacket);
        }
      }
    });
  }

  public sendPacketMQTT(unitGeneric: UnitGenericEntity, message: string): void {
    const topic = MQTTTopics.UNIT_POND + unitGeneric.id;
    const packet = JSON.stringify({
      topic,
      message,
    });
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_UNIT_GENERIC,
        data: packet,
      })
    );
  }

  public sendCreate(unitGenericWSDto: UnitGenericWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_CREATE_UNIT_GENERIC,
        data: JSON.stringify(unitGenericWSDto),
      })
    );
  }

  public sendUpdate(unitGenericWSDto: UnitGenericWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_UPDATE_UNIT_GENERIC,
        data: JSON.stringify(unitGenericWSDto),
      })
    );
  }
}
