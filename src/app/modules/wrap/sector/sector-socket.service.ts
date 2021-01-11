import { Injectable } from '@angular/core';
import { WSEndPoints } from 'src/app/shared/constants/ws-endpoints.enum';
import { WebsocketService } from './../../../shared/services/websocket.service';
import { SectorWSDto } from './dto/sector-ws.dto';
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
        if (event == WSEndPoints.EVENT_SECTOR) {
          this._sectorService.createOrUpdateWS(data);
        }
      }
    });
  }

  public sendChange(dto: SectorWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.EVENT_SECTOR,
        data: JSON.stringify(dto),
      })
    );
  }
}
