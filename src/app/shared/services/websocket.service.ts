import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  private _webSocket: WebSocket;
  private _received$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {
    this._webSocket = new WebSocket(environment.ws.url);
    this._webSocket.onopen = () => {
      console.log('Websocket connected!');
      this._webSocket.onmessage = (message) => {
        const dataJSON = JSON.parse(message.data);
        this._received$.next(dataJSON);
      };
    };
  }

  subscribeReceived(): BehaviorSubject<any> {
    return this._received$;
  }

  send(data: string) {
    this._webSocket.onopen = () => {
      this._webSocket.send(data);
    };
  }

  ngOnDestroy(): void {
    if (this._received$) {
      this._received$.unsubscribe();
    }
    if (this._webSocket) {
      this._webSocket.close();
    }
  }
}
