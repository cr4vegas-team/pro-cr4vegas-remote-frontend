import { Injectable } from '@angular/core';
import { UnitEvent } from 'src/app/shared/constants/event.enum';
import { WebsocketService } from './../../../shared/services/websocket.service';
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
        if (event == UnitEvent.EVENT_UNIT_SECTOR_CREATE) {
          this._sectorService.createWS(data);
        }
        if (event == UnitEvent.EVENT_UNIT_SECTOR_UPDATE) {
          this._sectorService.updateWS(data);
        }
      }
    });
  }
}
