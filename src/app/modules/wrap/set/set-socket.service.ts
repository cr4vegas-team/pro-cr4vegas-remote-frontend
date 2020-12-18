import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { WSEndPoints } from './../../../shared/constants/ws-endpoints.enum';
import { SetEntity } from './set.entity';
import { SetService } from './set.service';

@Injectable({
  providedIn: 'root',
})
export class SetSocketService {
  constructor(
    private readonly _socket: Socket,
    private readonly _setService: SetService
  ) {
    this._socket
      .fromEvent(WSEndPoints.RECEIVE_CREATE_SET)
      .subscribe((sector: string) => {
        this._setService.createWS(sector);
      });
    this._socket
      .fromEvent(WSEndPoints.RECEIVE_UPDATE_SET)
      .subscribe((sector: string) => {
        this._setService.updateWS(sector);
      });
  }

  public sendCreate(sector: SetEntity): void {
    this._socket.emit(WSEndPoints.SEND_CREATE_SET, sector);
  }

  public sendUpdate(sector: SetEntity): void {
    this._socket.emit(WSEndPoints.SEND_UPDATE_SET, sector);
  }
}
