import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  private _webSocket: WebSocket;
  private _received$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  connect(): void {
    this._webSocket = new WebSocket(environment.ws.url);
    this._webSocket.onopen = () => {
      console.log('¡Conexión con websocket exitosa!');
      this.send(
        JSON.stringify({
          event: 'client',
        })
      );
    };

    this._webSocket.onmessage = (message) => {
      const dataJSON = JSON.parse(message.data);
      this._received$.next(dataJSON);
    };

    this._webSocket.onclose = (e) => {
      console.log(
        'La conexión de websocket se cerró. Intento de conexión en 1 segundo...',
        e.reason
      );
      setTimeout(() => {
        this.connect();
      }, 1000);
    };

    this._webSocket.onerror = (err) => {
      console.error(
        'Websocket encontró un error: ',
        err,
        'Cerrando la conexión de websockets... (Recarge la página)'
      );
      this._webSocket.close();
    };
  }

  subscribeReceived(): BehaviorSubject<any> {
    return this._received$;
  }

  send(data: string): void {
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
