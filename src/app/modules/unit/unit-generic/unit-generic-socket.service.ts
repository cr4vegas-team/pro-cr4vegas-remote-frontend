import { Injectable } from '@angular/core';
import { MQTTTopics } from './../../../shared/constants/mqtt-topics.enum';
import { UnitGenericWSDto } from './dto/unit-generic-ws.dto';
import { UnitGenericEntity } from './unit-generic.entity';
import { UnitGenericService } from './unit-generic.service';

@Injectable({
  providedIn: 'root',
})
export class UnitGenericSocketService {
  constructor(
    private readonly _unitGenericService: UnitGenericService
  ) {
    /* this._socket
      .fromEvent(WSEndPoints.RECEIVE_UNIT_GENERIC)
      .subscribe((packet: string) => {
        const packetJSON = JSON.parse(packet);
        const mqttPacket = new MQTTPacket();
        mqttPacket.topic = packetJSON.topic;
        mqttPacket.message = packetJSON.message;
        this._unitGenericService.extractMQTTPacketAndAct(mqttPacket);
      });
    this._socket
      .fromEvent(WSEndPoints.RECEIVE_CREATE_UNIT_GENERIC)
      .subscribe((unitGeneric: string) => {
        this._unitGenericService.createWS(unitGeneric);
      });
    this._socket
      .fromEvent(WSEndPoints.RECEIVE_UPDATE_UNIT_GENERIC)
      .subscribe((unitGeneric: string) => {
        this._unitGenericService.updateWS(unitGeneric);
      }); */
  }

  public sendPacketMQTT(unitGeneric: UnitGenericEntity, message: string): void {
    const topic = MQTTTopics.UNIT_GENERIC + unitGeneric.id;
    const packet = JSON.stringify({
      topic,
      message,
    });
    // this._socket.emit(WSEndPoints.SEND_UNIT_GENERIC, packet);
  }

  public sendCreate(unitGenericWSDto: UnitGenericWSDto): void {
    // this._socket.emit(WSEndPoints.SEND_CREATE_UNIT_GENERIC, unitGenericWSDto);
  }

  public sendUpdate(unitGenericWSDto: UnitGenericWSDto): void {
    // this._socket.emit(WSEndPoints.SEND_UPDATE_UNIT_GENERIC, unitGenericWSDto);
  }
}
