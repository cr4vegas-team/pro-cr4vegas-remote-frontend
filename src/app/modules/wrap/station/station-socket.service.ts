import { Injectable } from '@angular/core';
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
    this._webSocketService.websocket().subscribe((websocket) => {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(
          JSON.stringify({
            event: 'test',
            data: 'data test...',
          })
        );
      }
    });
    /* this._socket
      .fromEvent(WSEndPoints.RECEIVE_CREATE_STATION)
      .subscribe((station: string) => {
        this._stationService.createWS(station);
      });
    this._socket
      .fromEvent(WSEndPoints.RECEIVE_UPDATE_STATION)
      .subscribe((station: string) => {
        this._stationService.updateWS(station);
      }); */
  }

  public sendCreate(station: StationEntity): void {
    // this._socket.emit(WSEndPoints.SEND_CREATE_STATION, station);
  }

  public sendUpdate(station: StationEntity): void {
    // this._socket.emit(WSEndPoints.SEND_UPDATE_STATION, station);
  }
}
