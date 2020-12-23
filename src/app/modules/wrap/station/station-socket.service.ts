import { StationWSDto } from './dto/station-ws.dto';
import { Injectable } from '@angular/core';
import { WSEndPoints } from './../../../shared/constants/ws-endpoints.enum';
import { WebsocketService } from './../../../shared/services/websocket.service';
import { StationEntity } from './station.entity';
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
        if (event == WSEndPoints.RECEIVE_CREATE_STATION) {
          this._stationService.createWS(data);
        }
        if (event == WSEndPoints.RECEIVE_UPDATE_STATION) {
          this._stationService.updateWS(data);
        }
      }
    });
  }

  public sendCreate(dto: StationWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_CREATE_STATION,
        data: JSON.stringify(dto),
      })
    );
  }

  public sendUpdate(dto: StationWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.SEND_UPDATE_STATION,
        data: JSON.stringify(dto),
      })
    );
  }
}
