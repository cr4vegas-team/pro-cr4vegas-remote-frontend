import { Injectable } from '@angular/core';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { UnitEvent } from 'src/app/shared/constants/event.enum';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class UnitHydrantSocketService {
  constructor(
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _webSocketService: WebsocketService
  ) {
    this._webSocketService.subscribeReceived().subscribe((received) => {
      if (received) {
        const event = received.event;
        const data = received.data;
        if (event === UnitEvent.EVENT_UNIT_HYDRANT_CREATE) {
          this._unitHydrantService.createWS(data);
        }
        if (event === UnitEvent.EVENT_UNIT_HYDRANT_UPDATE) {
          this._unitHydrantService.updateWS(data);
        }
      }
    });
  }
}
