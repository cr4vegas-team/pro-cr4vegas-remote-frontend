import { Injectable } from '@angular/core';
import { WSEndPoints } from 'src/app/shared/constants/ws-endpoints.enum';
import { WebsocketService } from './../../../shared/services/websocket.service';
import { SetEntity } from './set.entity';
import { SetService } from './set.service';

@Injectable({
  providedIn: 'root',
})
export class SetSocketService {
  private _webSocket: WebSocket;

  constructor(
    private readonly _setService: SetService,
    private readonly _webSocketService: WebsocketService
  ) {
    this._webSocketService.subscribeReceived().subscribe((received) => {
      if (received) {
        const event = received.event;
        const data = JSON.parse(received.data);
        if (event == WSEndPoints.RECEIVE_CREATE_SET) {
          this._setService.createWS(data);
        }
        if (event == WSEndPoints.RECEIVE_UPDATE_SET) {
          this._setService.updateWS(data);
        }
      }
    });
  }

  public sendCreate(set: SetEntity): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_CREATE_SET,
        data: JSON.stringify(set),
      })
    );
  }

  public sendUpdate(set: SetEntity): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_UPDATE_SET,
        data: JSON.stringify(set),
      })
    );
  }
}
