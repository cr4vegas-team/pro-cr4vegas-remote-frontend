import { Injectable } from '@angular/core';
import { UnitEvent } from 'src/app/shared/constants/event.enum';
import { WebsocketService } from './../../../shared/services/websocket.service';
import { SetService } from './set.service';

@Injectable({
  providedIn: 'root',
})
export class SetSocketService {
  constructor(
    private readonly _setService: SetService,
    private readonly _webSocketService: WebsocketService
  ) {
    this._webSocketService.subscribeReceived().subscribe((received) => {
      if (received) {
        const event = received.event;
        const data = JSON.parse(received.data);
        if (event == UnitEvent.EVENT_UNIT_SET_CREATE) {
          this._setService.createWS(data);
        }
        if (event == UnitEvent.EVENT_UNIT_SET_UPDATE) {
          this._setService.updateWS(data);
        }
      }
    });
  }
}
