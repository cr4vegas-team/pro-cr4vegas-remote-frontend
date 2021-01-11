import { Injectable } from '@angular/core';
import { WSEndPoints } from 'src/app/shared/constants/ws-endpoints.enum';
import { WebsocketService } from './../../../shared/services/websocket.service';
import { SetWSDto } from './dto/set-ws.dto';
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
        if (event == WSEndPoints.EVENT_SET) {
          this._setService.createOrUpdateWS(data);
        }
      }
    });
  }

  public sendChange(dto: SetWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.EVENT_SET,
        data: JSON.stringify(dto),
      })
    );
  }
}
