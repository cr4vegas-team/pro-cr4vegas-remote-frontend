import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { PondStateEnum } from 'src/app/shared/constants/pond-state.enum';
import { UnitTypeTableEnum } from 'src/app/shared/constants/unit-type-table.enum';
import { UnitFactory } from '../unit/unit.factory';
import { MapService } from './../../../shared/services/map.service';
import { UnitPondCreateDto } from './dto/unit-pond-create.dto';
import { UnitPondUpdateDto } from './dto/unit-pond-update.dto';
import { UnitPondWSDto } from './dto/unit-pond-ws.dto';
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
  //  VARS SUBJECTS
  // ==================================================
  private _markerChange$ = new BehaviorSubject<UnitPondEntity>(null);

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _unitFactory: UnitFactory,
    private readonly _mapService: MapService,
  ) {
    this._mapService.map.subscribe((map) => {
      if (map) {
        this._map = map;
      }
    });
  }

  public getMarkerChange(): BehaviorSubject<UnitPondEntity> {
    return this._markerChange$;
  }

  // ==================================================
  //  FACTORY FUNCTIONS
  // ==================================================
  public createUnitPond(unitPond: any): UnitPondEntity {
    const newUnitPond: UnitPondEntity = new UnitPondEntity();
    if (unitPond) {
      newUnitPond.id = unitPond.id;
      newUnitPond.m3 = unitPond.m3;
      newUnitPond.height = unitPond.height;
      newUnitPond.unit = this._unitFactory.createUnit(unitPond.unit);
      newUnitPond.unit.unitTypeTable = UnitTypeTableEnum.UNIT_POND;
      this.createMarker(newUnitPond);
    }
    return newUnitPond;
  }

  public copyUnitPond(target: UnitPondEntity, source: UnitPondEntity): void {
    target.m3 = source.m3;
    target.height = source.height;
    target.unit = this._unitFactory.createUnit(source.unit);
    target.marker.setLngLat([target.unit.longitude, target.unit.latitude]);
    this.createMarker(target);
  }

  public updateProperties(
    unitPond: UnitPondEntity,
    topicMessage: string
  ): void {
    if (unitPond.nodeSubscription) {
      unitPond.nodeSubscription.unsubscribe();
    }
    const dataSplit: string[] = topicMessage.split(',');
    if (dataSplit.length > 0) {
      switch (dataSplit[0]) {
        case '0':
          unitPond.unit.communication = 0;
          break;
        case '1':
          unitPond.unit.communication = 1;
          break;
        case '2':
          if (dataSplit[1]) {
            unitPond.level$.next(Number.parseInt(dataSplit[1]));
            this.checkBouysState(unitPond);
          }
          break;
        case '3':
          if (dataSplit[1]) {
            unitPond.unit.operator = dataSplit[1];
          }
          if (dataSplit[2]) {
            unitPond.unit.signal = Number.parseFloat(dataSplit[1]);
          }
          if (dataSplit[3]) {
            unitPond.unit.ip = dataSplit[1];
          }
          break;
        default:
      }
    }
    this.checkStatus(unitPond);
  }

  // ==================================================
  //  DTO FUNCTIONS
  // ==================================================
  public getUnitPondCreateDto(unitPond: any): UnitPondCreateDto {
    const unitPondCreateDto: UnitPondCreateDto = new UnitPondCreateDto();
    unitPondCreateDto.m3 = unitPond.m3;
    unitPondCreateDto.height = unitPond.height;
    unitPondCreateDto.unit = this._unitFactory.getUnitCreateDto(unitPond.unit);
    unitPondCreateDto.unit.unitTypeTable = UnitTypeTableEnum.UNIT_POND;
    return unitPondCreateDto;
  }

  public getUnitPondUpdateDto(unitPond: any): UnitPondUpdateDto {
    const unitPondUpdateDto: UnitPondUpdateDto = new UnitPondUpdateDto();
    unitPondUpdateDto.id = unitPond.id;
    unitPondUpdateDto.m3 = unitPond.m3;
    unitPondUpdateDto.height = unitPond.height;
    unitPondUpdateDto.unit = this._unitFactory.getUnitUpdateDto(unitPond.unit);
    return unitPondUpdateDto;
  }

  public getUnitPondWSDto(unitPond: any): UnitPondWSDto {
    const unitPondWSDto: UnitPondWSDto = new UnitPondWSDto();
    unitPondWSDto.id = unitPond.id;
    unitPondWSDto.m3 = unitPond.m3;
    unitPondWSDto.height = unitPond.height;
    unitPondWSDto.unit = this._unitFactory.getUnitWSDto(unitPond.unit);
    return unitPondWSDto;
  }

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
    const divCode = document.createElement('div');
    divCode.style.display = 'block';
    divCode.style.padding = '3px';
    divCode.style.borderRadius = '10px';
    divCode.style.border = '1px solid black';
    divCode.style.backgroundColor = 'rgba(255,255,255,0.8)';
    divCode.style.justifyContent = 'center';

    const title = document.createElement('div');
    title.innerText = unitPond.unit.sector.code + '-' + unitPond.unit.code;
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1em';
    title.style.padding = '1px';
    title.style.borderRadius = '5px';

    const point = document.createElement('div');
    point.style.width = '2.0em';
    point.style.height = '2.0em';
    point.style.backgroundColor = this.getMarkerColour(unitPond);
    point.style.margin = '1px auto';
    point.style.borderRadius = '50%';
    point.style.borderBottomRightRadius = '0%';
    point.style.borderBottomLeftRadius = '50%';
    point.style.borderTopRightRadius = '50%';
    point.style.borderTopLeftRadius = '50%';

    divCode.appendChild(title);
    divCode.appendChild(point);

    unitPond.marker = new Marker(divCode, {}).setLngLat([
      unitPond.unit.longitude,
      unitPond.unit.latitude,
    ]);

    this._markerChange$.next(unitPond);
    if (this._map) {
      unitPond.marker.addTo(this._map);
    }
  }

  // ==================================================
  //  MQTT
  // ==================================================
  private checkStatus(unitPond: UnitPondEntity): void {
    this.checkBouysState(unitPond);
    this.setMarkerColourAccourdingState(unitPond);
  }

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
    }
  }

  private setMarkerColourAccourdingState(unitPond: UnitPondEntity): void {
    unitPond.marker
      .getElement()
      .getElementsByTagName(
        'div'
      )[1].style.backgroundColor = this.getMarkerColour(unitPond);
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
}
