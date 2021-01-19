import { Injectable } from '@angular/core';
import { UnitPondService } from 'src/app/modules/unit/unit-pond/unit-pond.service';
import { WSEndPoints } from 'src/app/shared/constants/ws-endpoints.enum';
import { WebsocketService } from './../../../shared/services/websocket.service';
import { UnitPondWSDto } from './dto/unit-pond-ws.dto';
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
        const data = JSON.parse(received.data);
        if (event === WSEndPoints.EVENT_UNIT_POND) {
          this._unitPondService.createOrUpdateWS(data);
        }
      }
    });
  }

  public sendChange(unitPondWSDto: UnitPondWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.EVENT_UNIT_POND,
        data: JSON.stringify(unitPondWSDto),
      })
    );
  }
}
