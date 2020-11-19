import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { BehaviorSubject } from 'rxjs';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { PondStateEnum } from 'src/app/shared/constants/pond-state.enum';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';
import { UnitTypeTableEnum } from 'src/app/shared/constants/unit-type-table.enum';
import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
import { UnitFactory } from '../unit/unit.factory';
import { MapService } from './../../../shared/services/map.service';
import { UnitHydrantCreateDto } from './dto/unit-hydrant-create.dto';
import { UnitHydrantUpdateDto } from './dto/unit-hydrant-update.dto';
import { UnitHydrantWSDto } from './dto/unit-hydrant-ws.dto';
import { UnitHydrantEntity } from './unit-hydrant.entity';

@Injectable({
  providedIn: 'root',
})
export class UnitHydrantFactory {
  // ==================================================
  //  VARS
  // ==================================================
  private _map: Map;

  // ==================================================
  //  VARS SUBJECTS
  // ==================================================
  private _markerChange$ = new BehaviorSubject<UnitHydrantEntity>(null);

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _unitFactory: UnitFactory,
    private readonly _mqttEventService: MqttEventsService,
    private readonly _mapService: MapService
  ) {
    this._mapService.map.subscribe((map) => {
      if (map) {
        this._map = map;
      }
    });
  }

  public getMarkerChange(): BehaviorSubject<UnitHydrantEntity> {
    return this._markerChange$;
  }

  // ==================================================
  //  FACTORY FUNCTIONS
  // ==================================================
  public createUnitHydrant(unitHydrant: any): UnitHydrantEntity {
    const newUnitHydrant: UnitHydrantEntity = new UnitHydrantEntity();
    if (unitHydrant) {
      newUnitHydrant.id = unitHydrant.id;
      newUnitHydrant.filter = unitHydrant.filter;
      newUnitHydrant.diameter = unitHydrant.diameter;
      newUnitHydrant.unit = this._unitFactory.createUnit(unitHydrant.unit);
      newUnitHydrant.unit.unitTypeTable = UnitTypeTableEnum.UNIT_HYDRANT;
      this.createMarker(newUnitHydrant);
      this.subscribeToNode(newUnitHydrant);
    }
    return newUnitHydrant;
  }

  public copyUnitHydrant(
    target: UnitHydrantEntity,
    source: UnitHydrantEntity
  ): void {
    target.filter = source.filter;
    target.diameter = source.diameter;
    target.unit = this._unitFactory.createUnit(source.unit);
    this.createMarker(target);
    this.subscribeToNode(target);
  }

  // ==================================================
  //  DTO FUNCTIONS
  // ==================================================
  public getUnitHydrantCreateDto(unitHydrant: any): UnitHydrantCreateDto {
    const unitHydrantCreateDto: UnitHydrantCreateDto = new UnitHydrantCreateDto();
    unitHydrantCreateDto.filter = unitHydrant.filter;
    unitHydrantCreateDto.diameter = unitHydrant.diameter;
    unitHydrantCreateDto.unit = this._unitFactory.getUnitCreateDto(
      unitHydrant.unit
    );
    unitHydrantCreateDto.unit.unitTypeTable = UnitTypeTableEnum.UNIT_HYDRANT;

    return unitHydrantCreateDto;
  }

  public getUnitHydrantUpdateDto(unitHydrant: any): UnitHydrantUpdateDto {
    const unitHydrantUpdateDto: UnitHydrantUpdateDto = new UnitHydrantUpdateDto();
    unitHydrantUpdateDto.id = unitHydrant.id;
    unitHydrantUpdateDto.filter = unitHydrant.filter;
    unitHydrantUpdateDto.diameter = unitHydrant.diameter;
    unitHydrantUpdateDto.unit = this._unitFactory.getUnitUpdateDto(
      unitHydrant.unit
    );
    return unitHydrantUpdateDto;
  }

  public getUnitHydrantWSDto(unitHydrant: any): UnitHydrantWSDto {
    const unitHydrantWSDto: UnitHydrantWSDto = new UnitHydrantWSDto();
    unitHydrantWSDto.id = unitHydrant.id;
    unitHydrantWSDto.filter = unitHydrant.filter;
    unitHydrantWSDto.diameter = unitHydrant.diameter;
    unitHydrantWSDto.unit = this._unitFactory.getUnitWSDto(unitHydrant.unit);
    return unitHydrantWSDto;
  }

  public clean(unitHydrant: UnitHydrantEntity): void {
    if (unitHydrant.marker) {
      unitHydrant.marker.remove();
    }
    if (unitHydrant.nodeSubscription) {
      unitHydrant.nodeSubscription.unsubscribe();
    }
  }

  // ==================================================
  //  MARKER FUNCTIONS
  // ==================================================
  private createMarker(unitHydrant: UnitHydrantEntity): void {
    if (unitHydrant.marker) {
      unitHydrant.marker.remove();
    }
    const divCode = document.createElement('div');
    divCode.style.display = 'block';
    divCode.style.padding = '2px';
    divCode.style.borderRadius = '5px';
    divCode.style.border = '1px solid black';
    divCode.style.backgroundColor = 'rgba(255,255,255,1)';
    divCode.style.justifyContent = 'center';
    divCode.style.zIndex = '1';
    divCode.onmouseover = () => {
      (divCode.children[0] as HTMLElement).style.display = 'block';
      divCode.style.width = '60px';
      divCode.style.height = '70px';
      divCode.style.zIndex = '2';
    };
    divCode.onmouseleave = () => {
      (divCode.children[0] as HTMLElement).style.display = 'none';
      divCode.style.width = 'min-content';
      divCode.style.height = 'min-content';
      divCode.style.zIndex = '1';
    };
    const title = document.createElement('div');
    title.innerHTML = `
        Hidrante<br>
        <b>${unitHydrant.unit.sector.code} - ${unitHydrant.unit.code}</b>
    `;
    title.style.fontSize = '1em';
    title.style.display = 'none';
    title.style.textAlign = 'center';

    const point = document.createElement('div');
    point.style.width = '1.8em';
    point.style.height = '1.8em';
    point.style.backgroundColor = this.getMarkerColour(unitHydrant);
    point.style.margin = '0px auto';
    point.style.borderRadius = '50%';

    divCode.appendChild(title);
    divCode.appendChild(point);

    unitHydrant.marker = new Marker(divCode, {}).setLngLat([
      unitHydrant.unit.longitude,
      unitHydrant.unit.latitude,
    ]);

    this._markerChange$.next(unitHydrant);
    if (this._map) {
      unitHydrant.marker.addTo(this._map);
    }
  }

  public setMarkerState(unitHydrant: UnitHydrantEntity): void {
    this.setMarkerColourAccourdingState(unitHydrant);
    this.setMarkerAnimationAccordingState(unitHydrant);
  }

  private setMarkerColourAccourdingState(unitHydrant: UnitHydrantEntity): void {
    unitHydrant.marker
      .getElement()
      .getElementsByTagName(
        'div'
      )[1].style.backgroundColor = this.getMarkerColour(unitHydrant);
  }

  private getMarkerColour(unitHydrant: UnitHydrantEntity): string {
    if (unitHydrant.unit.active) {
      if (unitHydrant.unit.communication) {
        return this.getMarkerColourAccordingBouyState(unitHydrant);
      } else {
        return MarkerColourEnum.WITHOUT_COMMUNICATION;
      }
    }
    return MarkerColourEnum.INACTIVE;
  }

  private getMarkerColourAccordingBouyState(
    unitHydrant: UnitHydrantEntity
  ): string {
    if (unitHydrant.pondState) {
      if (unitHydrant.pondState === PondStateEnum.LOW) {
        return MarkerColourEnum.UNIT_POND_LOW;
      }
      if (unitHydrant.pondState === PondStateEnum.MEDIUM) {
        return MarkerColourEnum.UNIT_POND_MEDIUM;
      }
      if (unitHydrant.pondState === PondStateEnum.HIGTH) {
        return MarkerColourEnum.UNIT_POND_HIGTH;
      }
      if (unitHydrant.pondState === PondStateEnum.ALARM) {
        return MarkerColourEnum.ALARM;
      }
    } else {
      return MarkerColourEnum.UNIT_POND_LOW;
    }
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
    const observable = this._mqttEventService.observerWithID(
      TopicDestinationEnum.NODE,
      TopicTypeEnum.UNIT_HYDRANT,
      unitHydrant.id
    );
    unitHydrant.nodeSubscription = observable.subscribe(
      (data: IMqttMessage) => {
        const dataString = data.payload.toString();
        const dataSplit: string[] = dataString.split(',');
        if (dataSplit.length > 0) {
          if (dataSplit[0]) {
            unitHydrant.unit.communication = 1;
            unitHydrant.unit.received = 1;
          }
          if (dataSplit[1]) {
            unitHydrant.valve = dataSplit[1] === '0' ? 0 : 1;
            this.setMarkerAnimationAccordingState(unitHydrant);
          }
          if (dataSplit[2] && dataSplit[2] !== '') {
            unitHydrant.flow = Number.parseFloat(dataSplit[2]);
          }
          if (dataSplit[3] && dataSplit[3] !== '') {
            unitHydrant.reading = Number.parseFloat(dataSplit[3]);
            unitHydrant.readingBatch = unitHydrant.reading - unitHydrant.batch;
          }
          if (dataSplit[4]) {
            unitHydrant.bouyLow = dataSplit[4] === '0' ? false : true;
          }
          if (dataSplit[5]) {
            unitHydrant.bouyMedium = dataSplit[5] === '0' ? false : true;
          }
          if (dataSplit[6]) {
            unitHydrant.bouyHight = dataSplit[6] === '0' ? false : true;
          }
          if (dataSplit[7]) {
            unitHydrant.pressure = Number.parseFloat(dataSplit[7]);
          }
        }
        this.checkStatus(unitHydrant);
      }
    );
  }

  private checkStatus(unitHydrant: UnitHydrantEntity): void {
    this.checkBouysState(unitHydrant);
    this.checkBouysWarnings(unitHydrant);
  }

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
      this.setMarkerColourAccourdingState(unitHydrant);
      this.setMarkerAnimationAccordingState(unitHydrant);
    }
  }

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

  private setMarkerAnimationAccordingState(
    unitHydrant: UnitHydrantEntity
  ): void {
    if (
      unitHydrant.unit.active &&
      unitHydrant.unit.communication &&
      unitHydrant.valve
    ) {
      unitHydrant.marker.getElement().style.boxShadow =
        '0px 0px 10px 5px green';
    }
  }
}
