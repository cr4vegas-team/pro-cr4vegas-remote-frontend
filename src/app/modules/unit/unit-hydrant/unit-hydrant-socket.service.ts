import { UnitHydrantWSDto } from './dto/unit-hydrant-ws.dto';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { MQTTTopics } from './../../../shared/constants/mqtt-topics.enum';
import { WSEndPoints } from './../../../shared/constants/ws-endpoints.enum';
import { MQTTPacket } from './../../../shared/models/mqtt-packet.model';
import { UnitHydrantEntity } from './unit-hydrant.entity';

@Injectable({
  providedIn: 'root',
})
export class UnitHydrantSocketService {
  constructor(
    private readonly _socket: Socket,
    private readonly _unitHydrantService: UnitHydrantService
  ) {
    this._socket
      .fromEvent(WSEndPoints.RECEIVE_UNIT_HYDRANT)
      .subscribe((packet: string) => {
        const packetJSON = JSON.parse(packet);
        const mqttPacket = new MQTTPacket();
        mqttPacket.topic = packetJSON.topic;
        mqttPacket.message = packetJSON.message;
        this._unitHydrantService.extractMQTTPacketAndAct(mqttPacket);
      });
    this._socket.on(
      WSEndPoints.RECEIVE_CREATE_UNIT_HYDRANT,
      (unitHydrant: string) => {
        this._unitHydrantService.createWS(unitHydrant);
      }
    );
    this._socket.on(
      WSEndPoints.RECEIVE_UPDATE_UNIT_HYDRANT,
      (unitHydrant: string) => {
        this._unitHydrantService.updateWS(unitHydrant);
      }
    );
  }

  public sendPacketMQTT(unitHydrant: UnitHydrantEntity, message: string): void {
    const topic = MQTTTopics.UNIT_HYDRANT + unitHydrant.id;
    const packet = JSON.stringify({
      topic,
      message,
    });
    this._socket.emit(WSEndPoints.SEND_UNIT_HYDRANT, packet);
  }

  public sendCreate(unitHydrant: UnitHydrantWSDto): void {
    this._socket.emit(WSEndPoints.SEND_CREATE_UNIT_HYDRANT, unitHydrant);
  }

  public sendUpdate(unitHydrant: UnitHydrantWSDto): void {
    this._socket.emit(WSEndPoints.SEND_UPDATE_UNIT_HYDRANT, unitHydrant);
  }
}
