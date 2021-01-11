import { Injectable } from '@angular/core';
import { WSEndPoints } from './../../../shared/constants/ws-endpoints.enum';
import { WebsocketService } from './../../../shared/services/websocket.service';
import { StationWSDto } from './dto/station-ws.dto';
import { StationService } from './station.service';

@Injectable({
  providedIn: 'root',
})
export class StationSocketService {
  constructor(
    private readonly _stationService: StationService,
    private readonly _webSocketService: WebsocketService
  ) {
    this._webSocketService.subscribeReceived().subscribe((received) => {
      if (received) {
        const event = received.event;
        const data = JSON.parse(received.data);
        if (event == WSEndPoints.EVENT_STATION) {
          this._stationService.createOrUpdateWS(data);
        }
      }
    });
  }

  public sendChange(dto: StationWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.EVENT_STATION,
        data: JSON.stringify(dto),
      })
    );
  }
}
