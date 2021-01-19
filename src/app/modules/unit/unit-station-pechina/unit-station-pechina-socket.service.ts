import { Injectable } from '@angular/core';
import { WSEndPoints } from 'src/app/shared/constants/ws-endpoints.enum';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { UnitStationPechinaWSDto } from './dto/unit-station-pechina-ws.dto';
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
        const data = JSON.parse(received.data);
        if (event === WSEndPoints.EVENT_UNIT_STATION_PECHINA) {
          this._unitStationPechinaService.createOrUpdateWS(data);
        }
      }
    });
  }

  public sendChange(unitStationPechina: UnitStationPechinaWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.EVENT_UNIT_STATION_PECHINA,
        data: JSON.stringify(unitStationPechina),
      })
    );
  }
}
