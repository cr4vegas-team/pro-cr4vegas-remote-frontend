import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MqttEventsService {

  constructor(private _mqttService: MqttService) { }

  subscribe(topic: string): Observable<IMqttMessage> {
    return this._mqttService.observe('clients/' + topic);
  }

  async publish(topic: string, message: string) {
    while (true) {
      try {
        await this._mqttService.unsafePublish('server/' + topic, message);
        break;
      } catch (error) {
        console.log(error);
      }
    }
  }

}
