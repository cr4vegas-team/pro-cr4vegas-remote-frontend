import { Injectable } from '@angular/core';
import { Marker } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { PondStateEnum } from 'src/app/shared/constants/pond-state.enum';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';
import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
import { UnitFactory } from '../unit/unit.factory';
import { UnitPondCreateDto } from './dto/unit-pond-create.dto';
import { UnitPondUpdateDto } from './dto/unit-pond-update.dto';
import { UnitPondEntity } from './unit-pond.entity';

@Injectable({
  providedIn: 'root',
})
export class UnitPondFactory {
  constructor(
    private readonly _unitFactory: UnitFactory,
    private readonly _mqttEventService: MqttEventsService
  ) {}

  // ==================================================

  public createUnitPond(unitPond: UnitPondEntity): UnitPondEntity {
    const newUnitPond: UnitPondEntity = new UnitPondEntity();
    if (unitPond) {
      newUnitPond.id = unitPond.id;
      newUnitPond.m3 = unitPond.m3;
      newUnitPond.height = unitPond.height;
      newUnitPond.unit = this._unitFactory.createUnit(unitPond.unit);
      this.createMarker(newUnitPond);
      this.subscribeToNode(newUnitPond);
      this.subscribeToServer(newUnitPond);
      this.loadTestCommunication(newUnitPond);
    }
    return newUnitPond;
  }

  // ==================================================

  public copyUnitPond(target: UnitPondEntity, source: UnitPondEntity): void {
    target.m3 = source.m3;
    target.height = source.height;
    target.unit = this._unitFactory.createUnit(source.unit);
    target.marker.setLngLat([target.unit.longitude, target.unit.latitude]);
  }

  // ==================================================

  public getUnitPondCreateDto(unitPond: UnitPondEntity): UnitPondCreateDto {
    const unitPondCreateDto: UnitPondCreateDto = new UnitPondCreateDto();
    unitPondCreateDto.m3 = unitPond.m3;
    unitPondCreateDto.height = unitPond.height;
    unitPondCreateDto.unit = this._unitFactory.getUnitCreateDto(unitPond.unit);
    return unitPondCreateDto;
  }

  // ==================================================

  public getUnitPondUpdateDto(unitPond: UnitPondEntity): UnitPondUpdateDto {
    const unitPondUpdateDto: UnitPondUpdateDto = new UnitPondUpdateDto();
    unitPondUpdateDto.id = unitPond.id;
    unitPondUpdateDto.m3 = unitPond.m3;
    unitPondUpdateDto.height = unitPond.height;
    unitPondUpdateDto.unit = this._unitFactory.getUnitUpdateDto(unitPond.unit);
    return unitPondUpdateDto;
  }

  // ==================================================

  public clean(unitPond: UnitPondEntity): void {
    if (unitPond.marker) {
      unitPond.marker.remove();
    }
    if (unitPond.nodeSubscription) {
      unitPond.nodeSubscription.unsubscribe();
    }
    if (unitPond.serverSubscription) {
      unitPond.serverSubscription.unsubscribe();
    }
    if (unitPond.testInterval) {
      clearInterval(unitPond.testInterval);
    }
  }

  // ==================================================
  //  MARKER FUNCTIONS
  // ==================================================
  private createMarker(unitPond: UnitPondEntity): void {
    if (unitPond.marker) {
      unitPond.marker.remove();
    }
    unitPond.marker = new Marker({
      color: this.getMarkerColourAccordingBouyState(unitPond),
    }).setLngLat([unitPond.unit.longitude, unitPond.unit.latitude]);
  }

  // ==================================================

  private getMarkerColourAccordingBouyState(
    unitPond: UnitPondEntity
  ): MarkerColourEnum {
    if (unitPond.pondState) {
      if (unitPond.pondState === PondStateEnum.LOW) {
        return MarkerColourEnum.UNIT_POND_LOW;
      }
      if (unitPond.pondState === PondStateEnum.MEDIUM) {
        return MarkerColourEnum.UNIT_POND_MEDIUM;
      }
      if (unitPond.pondState === PondStateEnum.HIGTH) {
        return MarkerColourEnum.UNIT_POND_HIGTH;
      }
      if (unitPond.pondState === PondStateEnum.ALARM) {
        return MarkerColourEnum.ALARM;
      }
    } else {
      return MarkerColourEnum.UNIT_POND_LOW;
    }
  }

  // ==================================================
  //  TEST COMMUNICATION FUNCTIONS
  // ==================================================
  private loadTestCommunication(unitPond: UnitPondEntity): void {
    this.runTestCommunication(unitPond);
    unitPond.testInterval = setInterval(() => {
      this.runTestCommunication(unitPond);
    }, 300000);
  }

  // ==================================================

  private runTestCommunication(unitPond: UnitPondEntity): void {
    unitPond.unit.received = 0;
    this._mqttEventService.publish(
      TopicDestinationEnum.NODE_SERVER,
      TopicTypeEnum.UNIT_POND,
      unitPond.id,
      '0'
    );
    setTimeout(() => {
      if (unitPond.unit.received === 0 && unitPond.unit.communication !== 0) {
        unitPond.unit.communication = 0;
        this.createMarker(unitPond);
      }
    }, 20000);
  }

  // ==================================================
  //  MQTT
  // ==================================================

  // ----------------------------
  //  NODE SUBSCRIPTION
  // ----------------------------
  private subscribeToNode(unitPond: UnitPondEntity): void {
    if (unitPond.nodeSubscription) {
      unitPond.nodeSubscription.unsubscribe();
    }
    const observable = this._mqttEventService.subscribe(
      TopicDestinationEnum.NODE,
      TopicTypeEnum.UNIT_POND,
      unitPond.id
    );
    unitPond.nodeSubscription = observable.subscribe((data: IMqttMessage) => {
      const dataSplit: string[] = data.payload.toString().split(',');
      if (dataSplit[0]) {
        unitPond.level$.next(dataSplit[0] === '0' ? 0 : 1);
        unitPond.level$.next(Number.parseFloat(dataSplit[0]));
      }
      this.checkBouysState(unitPond);
    });
  }

  // ==================================================

  private checkBouysState(unitPond: UnitPondEntity): void {
    let bouysState: PondStateEnum = null;
    if (unitPond.level$.value < unitPond.level$.value / 3) {
      bouysState = PondStateEnum.LOW;
    }
    if (
      unitPond.level$.value >= unitPond.level$.value / 3 &&
      unitPond.level$.value < unitPond.level$.value / 2
    ) {
      bouysState = PondStateEnum.MEDIUM;
    }
    if (
      unitPond.level$.value >= unitPond.level$.value / 2 &&
      unitPond.level$.value < unitPond.level$.value - 0.2
    ) {
      bouysState = PondStateEnum.HIGTH;
    }
    if (unitPond.level$.value >= unitPond.level$.value - 0.2) {
      bouysState = PondStateEnum.ALARM;
    }
    if (unitPond.pondState !== bouysState) {
      unitPond.pondState = bouysState;
      this.createMarker(unitPond);
    }
  }

  // ----------------------------
  //  SERVER SUBSCRIPTION
  // ----------------------------

  private subscribeToServer(unitPond: UnitPondEntity): void {
    if (unitPond.serverSubscription) {
      unitPond.serverSubscription.unsubscribe();
    }
    const observable = this._mqttEventService.subscribe(
      TopicDestinationEnum.SERVER_DATA,
      TopicTypeEnum.UNIT_POND,
      unitPond.id
    );
    unitPond.serverSubscription = observable.subscribe((data: IMqttMessage) => {
      const json: any = JSON.parse(data.payload.toString());
      if (json.unitPond) {
        unitPond.height = json.unitPond.height ? json.unitPond.height : '';
        unitPond.m3 = json.unitPond.m3 ? json.unitPond.m3 : '';
        unitPond.unit = json.unitPond.unit ? json.unitPond.unit : '';
      } else {
        console.error('json.unitPond undefined or null');
      }
    });
  }
}
