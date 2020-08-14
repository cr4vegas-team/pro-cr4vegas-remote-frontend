import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Observable } from 'rxjs';
import { TopicTypeEnum } from '../constants/topic-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MqttEventsService {

  private CLIENT_TOPIC = 'client';
  private SERVER_TOPIC = 'server';

  constructor(private _mqttService: MqttService) { }

  subscribe(topicType: TopicTypeEnum, endPoint: string): Observable<IMqttMessage> {
    let topic = `${this.CLIENT_TOPIC}/${topicType}/${endPoint}`;
    if (endPoint !== null && endPoint !== '') {
      return this._mqttService.observeRetained(topic);
    } else {
      throw new Error('El punto final no puede estar vacío')
    }
  }

  async publish(topicType: TopicTypeEnum, endPoint: string, message: string) {
    let topic = `${this.SERVER_TOPIC}/${topicType}/${endPoint}`;
    if (endPoint !== null && endPoint !== '' && message !== null && message !== '') {
      while (true) {
        try {
          await this._mqttService.unsafePublish(topic, message);
          break;
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      throw new Error('El punto final y el mensaje no pueden quedan vacíos')
    }
  }

}
