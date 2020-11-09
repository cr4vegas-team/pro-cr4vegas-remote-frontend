import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { PondStateEnum } from 'src/app/shared/constants/pond-state.enum';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';
import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
import { UnitFactory } from '../unit/unit.factory';
import { MapService } from './../../../shared/services/map.service';
import { UnitPondCreateDto } from './dto/unit-pond-create.dto';
import { UnitPondUpdateDto } from './dto/unit-pond-update.dto';
import { UnitPondEntity } from './unit-pond.entity';

@Injectable({
  providedIn: 'root',
})
export class UnitPondFactory {
  // ==================================================
  //  VARS
  // ==================================================
  private _map: Map;

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

  // ==================================================
  //  FACTORY FUNCTIONS
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
    }
    return newUnitPond;
  }

  public updateUnitPond(target: UnitPondEntity, source: UnitPondEntity): void {
    target.m3 = source.m3;
    target.height = source.height;
    target.unit = this._unitFactory.createUnit(source.unit);
    target.marker.setLngLat([target.unit.longitude, target.unit.latitude]);
    this.createMarker(target);
    this.subscribeToNode(target);
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
  }

  // ==================================================
  //  MARKER FUNCTIONS
  // ==================================================
  private createMarker(unitPond: UnitPondEntity): void {
    if (unitPond.marker) {
      unitPond.marker.remove();
    }
    unitPond.marker = new Marker({
      color: this.getMarkerColour(unitPond),
    }).setLngLat([unitPond.unit.longitude, unitPond.unit.latitude]);
    if (this._map) {
      unitPond.marker.addTo(this._map);
    }
  }

  private getMarkerColour(unitPond: UnitPondEntity): string {
    if (unitPond.unit.active) {
      return this.getMarkerColourAccordingBouyState(unitPond);
    }
    return MarkerColourEnum.INACTIVE;
  }

  private getMarkerColourAccordingBouyState(unitPond: UnitPondEntity): string {
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
  //  MQTT
  // ==================================================

  // ----------------------------
  //  NODE SUBSCRIPTION
  // ----------------------------
  private subscribeToNode(unitPond: UnitPondEntity): void {
    if (unitPond.nodeSubscription) {
      unitPond.nodeSubscription.unsubscribe();
    }
    const observable = this._mqttEventService.observerWithID(
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
}
