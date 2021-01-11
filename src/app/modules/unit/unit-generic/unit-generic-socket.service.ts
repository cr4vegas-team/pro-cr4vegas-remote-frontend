import { Injectable } from '@angular/core';
import { WSEndPoints } from 'src/app/shared/constants/ws-endpoints.enum';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { UnitGenericWSDto } from './dto/unit-generic-ws.dto';
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
        const data = JSON.parse(received.data);
        if (event == WSEndPoints.EVENT_UNIT_GENERIC) {
          this._unitGenericService.createOrUpdateWS(data);
        }
      }
    });
  }

  public sendChange(unitGenericWSDto: UnitGenericWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.EVENT_UNIT_GENERIC,
        data: JSON.stringify(unitGenericWSDto),
      })
    );
  }
}
