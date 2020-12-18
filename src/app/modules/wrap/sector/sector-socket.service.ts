import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { WSEndPoints } from './../../../shared/constants/ws-endpoints.enum';
import { SectorEntity } from './sector.entity';
import { SectorService } from './sector.service';

@Injectable({
  providedIn: 'root',
})
export class SectorSocketService {
  constructor(
    private readonly _socket: Socket,
    private readonly _sectorService: SectorService
  ) {
    this._socket
      .fromEvent(WSEndPoints.RECEIVE_CREATE_SECTOR)
      .subscribe((sector: string) => {
        this._sectorService.createWS(sector);
      });
    this._socket
      .fromEvent(WSEndPoints.RECEIVE_UPDATE_SECTOR)
      .subscribe((sector: string) => {
        this._sectorService.updateWS(sector);
      });
  }

  public sendCreate(sector: SectorEntity): void {
    this._socket.emit(WSEndPoints.SEND_CREATE_SECTOR, sector);
  }

  public sendUpdate(sector: SectorEntity): void {
    this._socket.emit(WSEndPoints.SEND_UPDATE_SECTOR, sector);
  }
}
