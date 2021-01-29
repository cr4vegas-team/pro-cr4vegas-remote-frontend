import { Injectable } from '@angular/core';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { UnitEvent } from 'src/app/shared/constants/event.enum';
import { WebsocketService } from './../../../shared/services/websocket.service';
@Injectable({
  providedIn: 'root',
})
export class UnitPondSocketService {
  constructor(
    private readonly _unitPondService: UnitPondService,
    private readonly _webSocketService: WebsocketService
  ) {
    this._webSocketService.subscribeReceived().subscribe((received) => {
      if (received) {
        const event = received.event;
        const data = received.data;
        if (event === UnitEvent.EVENT_UNIT_POND_CREATE) {
          this._unitPondService.crateWS(data);
        }
        if (event === UnitEvent.EVENT_UNIT_POND_UPDATE) {
          this._unitPondService.updateWS(data);
        }
      }
    });
  }
}
