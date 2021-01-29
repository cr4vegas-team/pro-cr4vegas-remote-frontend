import { Injectable } from '@angular/core';
import { UnitEvent } from 'src/app/shared/constants/event.enum';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { UnitStationPechinaService } from './unit-station-pechina.service';

@Injectable({
  providedIn: 'root'
})
export class UnitStationPechinaSocketService {

  constructor(
    private readonly _unitStationPechinaService: UnitStationPechinaService,
    private readonly _webSocketService: WebsocketService
  ) {
    this._webSocketService.subscribeReceived().subscribe((received) => {
      if (received) {
        const event = received.event;
        const data = received.data;
        if (event === UnitEvent.EVENT_UNIT_STATION_PECHINA_UPDATE) {
          this._unitStationPechinaService.updateWS(data);
        }
      }
    });
  }
}
