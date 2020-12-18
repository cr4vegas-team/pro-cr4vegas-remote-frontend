import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { WSEndPoints } from './../../../shared/constants/ws-endpoints.enum';
import { StationEntity } from './station.entity';
import { StationService } from './station.service';

@Injectable({
  providedIn: 'root',
})
export class StationSocketService {
  constructor(
    private readonly _socket: Socket,
    private readonly _stationService: StationService
  ) {
    this._socket
      .fromEvent(WSEndPoints.RECEIVE_CREATE_STATION)
      .subscribe((station: string) => {
        this._stationService.createWS(station);
      });
    this._socket
      .fromEvent(WSEndPoints.RECEIVE_UPDATE_STATION)
      .subscribe((station: string) => {
        this._stationService.updateWS(station);
      });
  }

  public sendCreate(station: StationEntity): void {
    this._socket.emit(WSEndPoints.SEND_CREATE_STATION, station);
  }

  public sendUpdate(station: StationEntity): void {
    this._socket.emit(WSEndPoints.SEND_UPDATE_STATION, station);
  }
}
