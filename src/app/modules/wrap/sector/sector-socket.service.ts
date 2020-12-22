import { Injectable } from '@angular/core';
import { WSEndPoints } from 'src/app/shared/constants/ws-endpoints.enum';
import { WebsocketService } from './../../../shared/services/websocket.service';
import { SectorEntity } from './sector.entity';
import { SectorService } from './sector.service';

@Injectable({
  providedIn: 'root',
})
export class SectorSocketService {
  constructor(
    private readonly _sectorService: SectorService,
    private readonly _webSocketService: WebsocketService
  ) {
    this._webSocketService.subscribeReceived().subscribe((received) => {
      if (received) {
        const event = received.event;
        const data = JSON.parse(received.data);
        if (event == WSEndPoints.RECEIVE_CREATE_SECTOR) {
          this._sectorService.createWS(data);
        }
        if (event == WSEndPoints.RECEIVE_UPDATE_SECTOR) {
          this._sectorService.updateWS(data);
        }
      }
    });
  }

  public sendCreate(sector: SectorEntity): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_CREATE_SECTOR,
        data: JSON.stringify(sector),
      })
    );
  }

  public sendUpdate(sector: SectorEntity): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_UPDATE_SECTOR,
        data: JSON.stringify(sector),
      })
    );
  }
}
