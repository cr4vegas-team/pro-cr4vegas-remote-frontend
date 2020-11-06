import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
import { Injectable } from '@angular/core';
import { UnitFactory } from '../unit/unit.factory';
import { UnitHydrantCreateDto } from './dto/unit-hydrant-create.dto';
import { UnitHydrantUpdateDto } from './dto/unit-hydrant-update.dto';
import { UnitHydrantEntity } from './unit-hydrant.entity';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';
import { IMqttMessage } from 'ngx-mqtt';
import { PondStateEnum } from 'src/app/shared/constants/pond-state.enum';
import { MarkerAnimationEnum } from 'src/app/shared/constants/marker-animation.enum';
import { Marker } from 'mapbox-gl';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';

@Injectable({
  providedIn: 'root',
})
export class UnitHydrantFactory {
  constructor(
    private readonly _unitFactory: UnitFactory,
    private readonly _mqttEventService: MqttEventsService
  ) {}

  // ==================================================

  public createUnitHydrant(unitHydrant: any): UnitHydrantEntity {
    const newUnitHydrant: UnitHydrantEntity = new UnitHydrantEntity();
    if (unitHydrant) {
      newUnitHydrant.id = unitHydrant.id;
      newUnitHydrant.filter = unitHydrant.filter;
      newUnitHydrant.diameter = unitHydrant.diameter;
      newUnitHydrant.unit = this._unitFactory.createUnit(unitHydrant.unit);
      this.createMarker(newUnitHydrant);
      this.subscribeToNode(newUnitHydrant);
      this.subscribeToServer(newUnitHydrant);
      this.loadTestCommunication(newUnitHydrant);
    }
    return newUnitHydrant;
  }

  // ==================================================

  public copyUnitHydrant(
    target: UnitHydrantEntity,
    source: UnitHydrantEntity
  ): void {
    target.filter = source.filter;
    target.diameter = source.diameter;
    target.unit = this._unitFactory.createUnit(source.unit);
    target.marker.setLngLat([target.unit.longitude, target.unit.latitude]);
  }

  // ==================================================

  public getUnitHydrantCreateDto(
    unitHydrant: UnitHydrantEntity
  ): UnitHydrantCreateDto {
    const unitHydrantCreateDto: UnitHydrantCreateDto = new UnitHydrantCreateDto();
    unitHydrantCreateDto.filter = unitHydrant.filter;
    unitHydrantCreateDto.diameter = unitHydrant.diameter;
    unitHydrantCreateDto.unit = this._unitFactory.getUnitCreateDto(
      unitHydrant.unit
    );
    return unitHydrantCreateDto;
  }

  // ==================================================

  public getUnitHydrantUpdateDto(
    unitHydrant: UnitHydrantEntity
  ): UnitHydrantUpdateDto {
    const unitHydrantUpdateDto: UnitHydrantUpdateDto = new UnitHydrantUpdateDto();
    unitHydrantUpdateDto.id = unitHydrant.id;
    unitHydrantUpdateDto.filter = unitHydrant.filter;
    unitHydrantUpdateDto.diameter = unitHydrant.diameter;
    unitHydrantUpdateDto.unit = this._unitFactory.getUnitUpdateDto(
      unitHydrant.unit
    );
    return unitHydrantUpdateDto;
  }

  // ==================================================

  public clean(unitHydrant: UnitHydrantEntity): void {
    if (unitHydrant.marker) {
      unitHydrant.marker.remove();
    }
    if (unitHydrant.nodeSubscription) {
      unitHydrant.nodeSubscription.unsubscribe();
    }
    if (unitHydrant.serverSubscription) {
      unitHydrant.serverSubscription.unsubscribe();
    }
    if (unitHydrant.testInterval) {
      clearInterval(unitHydrant.testInterval);
    }
  }

  // ==================================================
  //  MARKER FUNCTIONS
  // ==================================================
  private createMarker(unitHydrant: UnitHydrantEntity): void {
    if (unitHydrant.marker) {
      unitHydrant.marker.remove();
    }
    unitHydrant.marker = new Marker({
      color: this.getMarkerColourAccordingBouyState(unitHydrant),
    }).setLngLat([unitHydrant.unit.longitude, unitHydrant.unit.latitude]);
    this.setAnimationAccordingState(unitHydrant);
  }

  // ==================================================

  private getMarkerColourAccordingBouyState(
    unitHydrant: UnitHydrantEntity
  ): MarkerColourEnum {
    if (unitHydrant.unit.communication) {
      if (unitHydrant.pondState) {
        if (unitHydrant.pondState === PondStateEnum.LOW) {
          return MarkerColourEnum.UNIT_HYDRANT_LOW;
        }
        if (unitHydrant.pondState === PondStateEnum.MEDIUM) {
          return MarkerColourEnum.UNIT_HYDRANT_MEDIUM;
        }
        if (unitHydrant.pondState === PondStateEnum.HIGTH) {
          return MarkerColourEnum.UNIT_HYDRANT_HIGTH;
        }
        if (unitHydrant.pondState === PondStateEnum.ALARM) {
          return MarkerColourEnum.ALARM;
        }
      } else {
        return MarkerColourEnum.UNIT_HYDRANT_LOW;
      }
    } else {
      return MarkerColourEnum.WITHOUT_COMMUNICATION;
    }
  }

  // ==================================================
  //  TEST COMMUNICATION FUNCTIONS
  // ==================================================
  private loadTestCommunication(unitHydrant: UnitHydrantEntity): void {
    this.runTestCommunication(unitHydrant);
    setInterval(() => {
      this.runTestCommunication(unitHydrant);
    }, 300000);
  }

  // ==================================================

  private runTestCommunication(unitHydrant: UnitHydrantEntity): void {
    unitHydrant.unit.received = 0;
    this._mqttEventService.publish(
      TopicDestinationEnum.NODE_SERVER,
      TopicTypeEnum.UNIT_HYDRANT,
      unitHydrant.id,
      '0'
    );
    setTimeout(() => {
      if (unitHydrant.unit.received === 0) {
        unitHydrant.unit.communication = 0;
      }
    }, 20000);
  }

  // ==================================================
  //  MQTT
  // ==================================================

  // ----------------------------
  //  NODE SUBSCRIPTION
  // ----------------------------
  private subscribeToNode(unitHydrant: UnitHydrantEntity): void {
    if (unitHydrant.nodeSubscription) {
      unitHydrant.nodeSubscription.unsubscribe();
    }
    const observable = this._mqttEventService.subscribe(
      TopicDestinationEnum.NODE,
      TopicTypeEnum.UNIT_HYDRANT,
      unitHydrant.id
    );
    unitHydrant.nodeSubscription = observable.subscribe(
      (data: IMqttMessage) => {
        const dataString = data.payload.toString();
        const dataSplit: string[] = dataString.split(',');
        const con = unitHydrant.unit.communication
          ? unitHydrant.unit.communication.toString()
          : '';
        if (dataString && dataString !== con) {
          if (dataString === '1') {
            unitHydrant.unit.communication = 1;
            unitHydrant.unit.received = 1;
          }
        }
        if (dataSplit.length > 1) {
          if (dataSplit[0]) {
            unitHydrant.valve = dataSplit[0] === '0' ? 0 : 1;
            this.setAnimationAccordingState(unitHydrant);
          }
          if (dataSplit[1] && dataSplit[1] !== '') {
            unitHydrant.flow = Number.parseFloat(dataSplit[1]);
          }
          if (dataSplit[2] && dataSplit[2] !== '') {
            unitHydrant.reading = Number.parseFloat(dataSplit[2]);
            unitHydrant.readingBatch = unitHydrant.reading - unitHydrant.batch;
          }
          if (dataSplit[3]) {
            unitHydrant.bouyLow = dataSplit[3] === '0' ? false : true;
          }
          if (dataSplit[4]) {
            unitHydrant.bouyMedium = dataSplit[4] === '0' ? false : true;
          }
          if (dataSplit[5]) {
            unitHydrant.bouyHight = dataSplit[5] === '0' ? false : true;
          }
          if (dataSplit[6]) {
            unitHydrant.pressure = Number.parseFloat(dataSplit[6]);
          }
        }
        this.checkStatus(unitHydrant);
      }
    );
  }

  // ==================================================

  private checkStatus(unitHydrant: UnitHydrantEntity): void {
    this.checkBouysState(unitHydrant);
    this.checkBouysWarnings(unitHydrant);
  }

  // ==================================================

  private checkBouysState(unitHydrant: UnitHydrantEntity): void {
    let bouysState: PondStateEnum = null;
    if (!unitHydrant.bouyLow) {
      bouysState = PondStateEnum.LOW;
    }
    if (unitHydrant.bouyLow) {
      bouysState = PondStateEnum.MEDIUM;
    }
    if (unitHydrant.bouyMedium) {
      bouysState = PondStateEnum.HIGTH;
    }
    if (unitHydrant.bouyHight) {
      bouysState = PondStateEnum.ALARM;
    }
    if (unitHydrant.pondState !== bouysState) {
      unitHydrant.pondState = bouysState;
      this.createMarker(unitHydrant);
    }
  }

  // ==================================================

  private checkBouysWarnings(unitHydrant: UnitHydrantEntity): void {
    let bouysWarnings = '';
    if (!unitHydrant.bouyLow && unitHydrant.bouyMedium) {
      bouysWarnings = 'Comprobar las boyas baja y media. ';
    }
    if (
      !unitHydrant.bouyLow &&
      !unitHydrant.bouyMedium &&
      unitHydrant.bouyHight
    ) {
      bouysWarnings = 'Comprobar las boyas media y alta. ';
    }
    if (
      (unitHydrant.bouyLow &&
        unitHydrant.bouyMedium &&
        !unitHydrant.bouyHight) ||
      (!unitHydrant.bouyLow && unitHydrant.bouyMedium && !unitHydrant.bouyHight)
    ) {
      bouysWarnings = `
          ${bouysWarnings}
          En el estado "${unitHydrant.pondState}" deberías tomar precaución.
          La boya de Alarma de nivel solo se puede comprobar físicamente`;
    }
    unitHydrant.bouyWarning = bouysWarnings;
  }

  // ==================================================

  private setAnimationAccordingState(unitHydrant: UnitHydrantEntity): void {
    if (unitHydrant.valve) {
      unitHydrant.marker.getElement().style.animation =
        'fade 0.5s 0.5s infinite linear both';
      if (unitHydrant.pondState === PondStateEnum.ALARM) {
        unitHydrant.marker.getElement().style.boxShadow = `${MarkerAnimationEnum.CLOSED}`;
      } else {
        unitHydrant.marker.getElement().style.boxShadow = `${MarkerAnimationEnum.OPEN}`;
      }
      unitHydrant.marker.getElement().style.borderRadius = '50%';
    } else {
      unitHydrant.marker.getElement().style.animation =
        MarkerAnimationEnum.NONE;
      unitHydrant.marker.getElement().style.boxShadow =
        MarkerAnimationEnum.NONE;
    }
  }

  // ----------------------------
  //  SERVER SUBSCRIPTION
  // ----------------------------
  private subscribeToServer(unitHydrant: UnitHydrantEntity): void {
    if (unitHydrant.serverSubscription) {
      unitHydrant.serverSubscription.unsubscribe();
    }
    const observable = this._mqttEventService.subscribe(
      TopicDestinationEnum.SERVER_DATA,
      TopicTypeEnum.UNIT_HYDRANT,
      unitHydrant.id
    );
    unitHydrant.serverSubscription = observable.subscribe(
      (data: IMqttMessage) => {
        const json: any = JSON.parse(data.payload.toString());
        if (json.unitHydrant) {
          unitHydrant.filter = json.unitHydrant.filter
            ? json.unitHydrant.filter
            : '';
          unitHydrant.diameter = json.unitHydrant.diameter
            ? json.unitHydrant.diameter
            : '';
          unitHydrant.unit = json.unitHydrant.unit ? json.unitHydrant.unit : '';
        } else {
          console.error('json.unitHydrant undefined or null');
        }
      }
    );
  }
}
