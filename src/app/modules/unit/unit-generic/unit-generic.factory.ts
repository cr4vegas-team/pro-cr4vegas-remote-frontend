import { Injectable } from '@angular/core';
import { Marker } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';
import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
import { UnitFactory } from '../unit/unit.factory';
import { UnitGenericCreateDto } from './dto/unit-generic-create.dto';
import { UnitGenericUpdateDto } from './dto/unit-generic-update.dto';
import { UnitGenericEntity } from './unit-generic.entity';

@Injectable({
  providedIn: 'root',
})
export class UnitGenericFactory {
  constructor(
    private readonly _unitFactory: UnitFactory,
    private readonly _mqttEventService: MqttEventsService
  ) {}

  // ==================================================

  public createUnitGeneric(unitGeneric: any): UnitGenericEntity {
    const newUnitGeneric: UnitGenericEntity = new UnitGenericEntity();
    if (unitGeneric) {
      newUnitGeneric.id = unitGeneric.id;
      newUnitGeneric.data1 = unitGeneric.data1;
      newUnitGeneric.data2 = unitGeneric.data2;
      newUnitGeneric.data3 = unitGeneric.data3;
      newUnitGeneric.data4 = unitGeneric.data4;
      newUnitGeneric.data5 = unitGeneric.data5;
      newUnitGeneric.unit = this._unitFactory.createUnit(unitGeneric.unit);
      this.createMarker(newUnitGeneric);
      this.subscribeToNode(newUnitGeneric);
      this.subscribeToServer(newUnitGeneric);
      this.loadTestCommunication(newUnitGeneric);
    }
    return newUnitGeneric;
  }

  // ==================================================

  public updateUnitGeneric(target: UnitGenericEntity, source: any): void {
    target.data1 = source.data1;
    target.data2 = source.data2;
    target.data3 = source.data3;
    target.data4 = source.data4;
    target.data5 = source.data5;
    target.unit = this._unitFactory.updateUnit(target.unit, source.unit);
    target.marker.setLngLat([target.unit.longitude, target.unit.latitude]);
  }

  // ==================================================

  public getUnitGenericCreateDto(
    unitGeneric: UnitGenericEntity
  ): UnitGenericCreateDto {
    const unitGenericCreateDto: UnitGenericCreateDto = new UnitGenericCreateDto();
    unitGenericCreateDto.data1 = unitGeneric.data1;
    unitGenericCreateDto.data2 = unitGeneric.data2;
    unitGenericCreateDto.data3 = unitGeneric.data3;
    unitGenericCreateDto.data4 = unitGeneric.data4;
    unitGenericCreateDto.data5 = unitGeneric.data5;
    unitGenericCreateDto.unit = this._unitFactory.getUnitCreateDto(
      unitGeneric.unit
    );
    return unitGenericCreateDto;
  }

  // ==================================================

  public getUnitGenericUpdateDto(
    unitGeneric: UnitGenericEntity
  ): UnitGenericUpdateDto {
    const unitGenericUpdateDto: UnitGenericUpdateDto = new UnitGenericUpdateDto();
    unitGenericUpdateDto.id = unitGeneric.id;
    unitGenericUpdateDto.data1 = unitGeneric.data1;
    unitGenericUpdateDto.data2 = unitGeneric.data2;
    unitGenericUpdateDto.data3 = unitGeneric.data3;
    unitGenericUpdateDto.data4 = unitGeneric.data4;
    unitGenericUpdateDto.data5 = unitGeneric.data5;
    unitGenericUpdateDto.unit = this._unitFactory.getUnitUpdateDto(
      unitGeneric.unit
    );
    return unitGenericUpdateDto;
  }

  // ==================================================

  public clean(unitGeneric: UnitGenericEntity): void {
    if (unitGeneric.marker) {
      unitGeneric.marker.remove();
    }
    if (unitGeneric.nodeSubscription) {
      unitGeneric.nodeSubscription.unsubscribe();
    }
    if (unitGeneric.serverSubscription) {
      unitGeneric.serverSubscription.unsubscribe();
    }
    if (unitGeneric.testInterval) {
      clearInterval(unitGeneric.testInterval);
    }
  }

  // ==================================================
  //  MARKER FUNCTIONS
  // ==================================================
  private createMarker(unitGeneric: UnitGenericEntity): void {
    if (unitGeneric.marker) {
      unitGeneric.marker.remove();
    }
    unitGeneric.marker = new Marker({
      color: this.getMarkerColour(unitGeneric),
    }).setLngLat([unitGeneric.unit.longitude, unitGeneric.unit.latitude]);
  }

  // ==================================================

  private getMarkerColour(unitGEneric: UnitGenericEntity): string {
    if (unitGEneric.unit.communication) {
      return MarkerColourEnum.UNIT_GENERIC;
    } else {
      return MarkerColourEnum.WITHOUT_COMMUNICATION;
    }
  }

  // ==================================================
  //  TEST COMMUNICATION FUNCTIONS
  // ==================================================
  private loadTestCommunication(unitGeneric: UnitGenericEntity): void {
    this.runTestCommunication(unitGeneric);
    unitGeneric.testInterval = setInterval(() => {
      this.runTestCommunication(unitGeneric);
    }, 300000);
  }

  // ==================================================

  private runTestCommunication(unitGeneric: UnitGenericEntity): void {
    unitGeneric.unit.received = 0;
    this._mqttEventService.publish(
      TopicDestinationEnum.NODE_SERVER,
      TopicTypeEnum.UNIT_GENERIC,
      unitGeneric.id,
      '0'
    );
    setTimeout(() => {
      if (
        unitGeneric.unit.received === 0 &&
        unitGeneric.unit.communication !== 0
      ) {
        unitGeneric.unit.communication = 0;
        this.createMarker(unitGeneric);
      }
    }, 20000);
  }

  // ==================================================
  //  MQTT
  // ==================================================

  // ----------------------------
  //  NODE SUBSCRIPTION
  // ----------------------------
  private subscribeToNode(unitGeneric: UnitGenericEntity): void {
    if (unitGeneric.nodeSubscription) {
      unitGeneric.nodeSubscription.unsubscribe();
    }
    const observable = this._mqttEventService.subscribe(
      TopicDestinationEnum.NODE,
      TopicTypeEnum.UNIT_GENERIC,
      unitGeneric.id
    );
    unitGeneric.nodeSubscription = observable.subscribe(
      (data: IMqttMessage) => {
        const dataSplit: string[] = data.payload.toString().split(',');
        if (dataSplit.length > 0) {
          if (dataSplit[0] && dataSplit[0] === '1') {
            if (unitGeneric.unit.communication === 0) {
              unitGeneric.unit.communication = 1;
              this.createMarker(unitGeneric);
            }
            unitGeneric.unit.received = 1;
          }
          if (dataSplit[1]) {
            unitGeneric.property1 = dataSplit[0];
          }
          if (dataSplit[2]) {
            unitGeneric.property2 = dataSplit[1];
          }
          if (dataSplit[3]) {
            unitGeneric.property3 = dataSplit[2];
          }
          if (dataSplit[4]) {
            unitGeneric.property4 = dataSplit[3];
          }
          if (dataSplit[5]) {
            unitGeneric.property5 = dataSplit[4];
          }
        }
      }
    );
  }

  // ----------------------------
  //  SERVER SUBSCRIPTION
  // ----------------------------
  private subscribeToServer(unitGeneric: UnitGenericEntity): void {
    if (unitGeneric.serverSubscription) {
      unitGeneric.serverSubscription.unsubscribe();
    }
    const observable = this._mqttEventService.subscribe(
      TopicDestinationEnum.SERVER_DATA,
      TopicTypeEnum.UNIT_GENERIC,
      unitGeneric.id
    );
    unitGeneric.serverSubscription = observable.subscribe(
      (data: IMqttMessage) => {
        const json: any = JSON.parse(data.payload.toString());
        if (json.unitGeneric) {
          this.updateUnitGeneric(unitGeneric, json.unitGeneric);
        } else {
          console.error('json.unitGeneric undefined or null');
        }
      }
    );
  }
}
