import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { WSEvent } from './ws-events.enum';

@Injectable({
  providedIn: 'root',
})
export class UserSocketService {
  private _users$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  constructor(private readonly _webSocketService: WebsocketService) {
    this._webSocketService.subscribeReceived().subscribe((received) => {
      if (received) {
        const event = received.event;
        if (event === WSEvent.LOGIN || event === WSEvent.LOGOUT) {
          this._users$.next(received.data);
        }
      }
    });
  }

  public getUsers$(): BehaviorSubject<string[]> {
    return this._users$;
  }
}
