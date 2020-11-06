import { TopicDestinationEnum } from './../constants/topic-destination.enum';
import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Observable } from 'rxjs';
import { TopicTypeEnum } from '../../shared/constants/topic-type.enum';

@Injectable({
  providedIn: 'root',
})
export class MqttEventsService {
  constructor(private _mqttService: MqttService) {}

  subscribe(
    topicDestination: TopicDestinationEnum,
    topicType: TopicTypeEnum,
    endPoint: number
  ): Observable<IMqttMessage> {
    const topic = `${topicDestination}/${topicType}/${endPoint}`;
    if (endPoint !== null && !isNaN(endPoint)) {
      return this._mqttService.observeRetained(topic);
    } else {
      throw new Error('El punto final debe ser un número (ID)');
    }
  }

  async publish(
    topicDestination: TopicDestinationEnum,
    topicType: TopicTypeEnum,
    endPoint: number,
    message: string
  ): Promise<void> {
    const topic = `${topicDestination}/${topicType}/${endPoint}`;
    if (
      endPoint !== null &&
      !isNaN(endPoint) &&
      message !== null &&
      message !== ''
    ) {
      while (true) {
        try {
          await this._mqttService.unsafePublish(topic, message);
          break;
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      throw new Error('El punto final y el mensaje no pueden quedan vacíos');
    }
  }
}
