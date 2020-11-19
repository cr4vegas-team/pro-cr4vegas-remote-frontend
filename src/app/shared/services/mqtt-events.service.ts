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

  public observerWithID(
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

  public observe(
    topicDestination: TopicDestinationEnum,
    topicType: TopicTypeEnum
  ): Observable<IMqttMessage> {
    const topic = `${topicDestination}/${topicType}`;
    return this._mqttService.observeRetained(topic);
  }

  public async publishWithID(
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
          await this._mqttService.unsafePublish(topic, message, {
            qos: 2,
          });
          break;
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      throw new Error('El punto final y el mensaje no pueden quedan vacíos');
    }
  }

  public async publish(
    topicDestination: TopicDestinationEnum,
    topicType: TopicTypeEnum,
    message: string
  ): Promise<void> {
    const topic = `${topicDestination}/${topicType}`;
    if (message !== null && message !== '') {
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
