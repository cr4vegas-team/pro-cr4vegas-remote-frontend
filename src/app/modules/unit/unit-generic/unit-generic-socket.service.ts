import { Injectable } from '@angular/core';
import { UnitEvent } from 'src/app/shared/constants/event.enum';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { UnitGenericService } from './unit-generic.service';

@Injectable({
  providedIn: 'root',
})
export class UnitGenericSocketService {
  constructor(
    private readonly _unitGenericService: UnitGenericService,
    private readonly _webSocketService: WebsocketService
  ) {
    this._webSocketService.subscribeReceived().subscribe((received) => {
      if (received) {
        const event = received.event;
        const data = received.data;
        if (event == UnitEvent.EVENT_UNIT_GENERIC_CREATE) {
          this._unitGenericService.createWS(data);
        }
        if (event == UnitEvent.EVENT_UNIT_GENERIC_UPDATE) {
          this._unitGenericService.updateWS(data);
        }
      }
    });
  }
}
