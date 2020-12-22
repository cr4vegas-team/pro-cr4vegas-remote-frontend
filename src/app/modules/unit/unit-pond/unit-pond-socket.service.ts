import { Injectable } from '@angular/core';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { WSEndPoints } from 'src/app/shared/constants/ws-endpoints.enum';
import { MQTTPacket } from 'src/app/shared/models/mqtt-packet.model';
import { MQTTTopics } from './../../../shared/constants/mqtt-topics.enum';
import { WebsocketService } from './../../../shared/services/websocket.service';
import { UnitPondWSDto } from './dto/unit-pond-ws.dto';
import { UnitPondEntity } from './unit-pond.entity';
@Injectable({
  providedIn: 'root',
})
export class UnitPondSocketService {
  constructor(
    private readonly _unitPondService: UnitPondService,
    private readonly _webSocketService: WebsocketService
  ) {
    this._webSocketService.subscribeReceived().subscribe((received) => {
      if (received) {
        const event = received.event;
        const data = JSON.parse(received.data);
        if (event == WSEndPoints.RECEIVE_CREATE_UNIT_POND) {
          this._unitPondService.createWS(data);
        }
        if (event == WSEndPoints.RECEIVE_UPDATE_UNIT_POND) {
          this._unitPondService.updateWS(data);
        }
        if (event == WSEndPoints.RECEIVE_UNIT_POND) {
          const mqttPacket = new MQTTPacket();
          mqttPacket.topic = data.topic;
          mqttPacket.message = data.message;
          this._unitPondService.extractMQTTPacketAndAct(mqttPacket);
        }
      }
    });
  }

  public sendPacketMQTT(unitPond: UnitPondEntity, message: string): void {
    const topic = MQTTTopics.UNIT_POND + unitPond.id;
    const packet = JSON.stringify({
      topic,
      message,
    });
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_UNIT_POND,
        data: packet,
      })
    );
  }

  public sendCreate(unitPondWSDto: UnitPondWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_CREATE_UNIT_POND,
        data: JSON.stringify(unitPondWSDto),
      })
    );
  }

  public sendUpdate(unitPondWSDto: UnitPondWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_UPDATE_UNIT_POND,
        data: JSON.stringify(unitPondWSDto),
      })
    );
  }
}
