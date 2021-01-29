import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MqttEventService {
  constructor(private readonly _mqttService: MqttService) {
    this._mqttService.onConnect.asObservable().subscribe(() => {
      console.log('¡Conexión con MQTT exitosa!');
    });
    this._mqttService.onClose.asObservable().subscribe(() => {
      console.log('¡Conexión con MQTT caida!');
    });
    this._mqttService.onReconnect.asObservable().subscribe(() => {
      console.log('¡Reconectando con MQTT!');
    });
  }

  public unsafePublish(topic: string, message: string): void {
    this._mqttService.unsafePublish(topic, message);
  }

  public observe(topic: string): Observable<IMqttMessage> {
    return this._mqttService.observeRetained(topic);
  }
}
