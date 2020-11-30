import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  private _websocket$: BehaviorSubject<WebSocket>;

  constructor() {
    this._websocket$ = new BehaviorSubject(new WebSocket(environment.ws.url));
    if (this._websocket$.value.readyState == WebSocket.OPEN) {
      console.log('CONECTADO!');
      this._websocket$.value.send(
        JSON.stringify({
          event: 'test',
          data: 'msg',
        })
      );
    } else {
      console.log('NO CONECTADO!');
    }
  }

  websocket(): BehaviorSubject<WebSocket> {
    return this._websocket$;
  }

  ngOnDestroy(): void {
    if (this._websocket$) {
      this._websocket$.unsubscribe();
    }
  }
}
