import { UnitPondWSDto } from './dto/unit-pond-ws.dto';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { MQTTTopics } from './../../../shared/constants/mqtt-topics.enum';
import { WSEndPoints } from './../../../shared/constants/ws-endpoints.enum';
import { MQTTPacket } from './../../../shared/models/mqtt-packet.model';
import { UnitPondEntity } from './unit-pond.entity';

@Injectable({
  providedIn: 'root',
})
export class UnitPondSocketService {
  constructor(
    private readonly _socket: Socket,
    private readonly _unitPondService: UnitPondService
  ) {
    this._socket
      .fromEvent(WSEndPoints.RECEIVE_UNIT_POND)
      .subscribe((packet: string) => {
        const packetJSON = JSON.parse(packet);
        const mqttPacket = new MQTTPacket();
        mqttPacket.topic = packetJSON.topic;
        mqttPacket.message = packetJSON.message;
        this._unitPondService.extractMQTTPacketAndAct(mqttPacket);
      });
    this._socket
      .fromEvent(WSEndPoints.RECEIVE_CREATE_UNIT_POND)
      .subscribe((unitPond: string) => {
        this._unitPondService.createWS(unitPond);
      });
    this._socket
      .fromEvent(WSEndPoints.RECEIVE_UPDATE_UNIT_POND)
      .subscribe((unitPond: string) => {
        this._unitPondService.updateWS(unitPond);
      });
  }

  public sendPacketMQTT(unitPond: UnitPondEntity, message: string): void {
    const topic = MQTTTopics.UNIT_POND + unitPond.id;
    const packet = JSON.stringify({
      topic,
      message,
    });
    this._socket.emit(WSEndPoints.SEND_UNIT_POND, packet);
  }

  public sendCreate(unitPondWSDto: UnitPondWSDto): void {
    this._socket.emit(WSEndPoints.SEND_CREATE_UNIT_POND, unitPondWSDto);
  }

  public sendUpdate(unitPondWSDto: UnitPondWSDto): void {
    this._socket.emit(WSEndPoints.SEND_UPDATE_UNIT_POND, unitPondWSDto);
  }
}
