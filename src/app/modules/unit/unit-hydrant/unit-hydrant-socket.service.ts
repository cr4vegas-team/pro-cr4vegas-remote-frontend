import { Injectable } from '@angular/core';
import { UnitHydrantService } from 'src/app/modules/unit/unit-hydrant/unit-hydrant.service';
import { WSEndPoints } from 'src/app/shared/constants/ws-endpoints.enum';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { UnitHydrantWSDto } from './dto/unit-hydrant-ws.dto';

@Injectable({
  providedIn: 'root',
})
export class UnitHydrantSocketService {
  constructor(
    private readonly _unitHydrantService: UnitHydrantService,
    private readonly _webSocketService: WebsocketService
  ) {
    this._webSocketService.subscribeReceived().subscribe((received) => {
      if (received) {
        const event = received.event;
        const data = JSON.parse(received.data);
        if (event == WSEndPoints.EVENT_UNIT_HYDRANT) {
          this._unitHydrantService.createOrUpdateWS(data);
        }
      }
    });
  }

  public sendChange(unitHydrant: UnitHydrantWSDto): void {
    this._webSocketService.send(
      JSON.stringify({
        event: WSEndPoints.EVENT_UNIT_HYDRANT,
        data: JSON.stringify(unitHydrant),
      })
    );
  }

}
