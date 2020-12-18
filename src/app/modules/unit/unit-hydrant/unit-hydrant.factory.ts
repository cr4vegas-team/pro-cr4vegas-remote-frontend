import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { PondStateEnum } from 'src/app/shared/constants/pond-state.enum';
import { UnitTypeTableEnum } from 'src/app/shared/constants/unit-type-table.enum';
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
      newUnitHydrant.initBatch = unitHydrant.initBatch;
      newUnitHydrant.filter = unitHydrant.filter;
      newUnitHydrant.diameter = unitHydrant.diameter;
      newUnitHydrant.unit = this._unitFactory.createUnit(unitHydrant.unit);
      newUnitHydrant.unit.unitTypeTable = UnitTypeTableEnum.UNIT_HYDRANT;
      this.createMarker(newUnitHydrant);
    }
    return newUnitHydrant;
  }

  public copyUnitHydrant(
    target: UnitHydrantEntity,
    source: UnitHydrantEntity
  ): void {
    target.initBatch = source.initBatch;
    target.filter = source.filter;
    target.diameter = source.diameter;
    target.unit = this._unitFactory.createUnit(source.unit);
    this.createMarker(target);
  }

  public updateProperties(
    unitHydrant: UnitHydrantEntity,
    topicMessage: string
  ): void {
    const dataSplit: string[] = topicMessage.toString().split(',');
    if (dataSplit.length > 0) {
      switch (dataSplit[0]) {
        case '0':
          unitHydrant.unit.communication = 0;
          break;
        case '1':
          unitHydrant.unit.communication = 1;
          break;
        case '2':
          unitHydrant.unit.communication = 1;
          if (dataSplit[1]) {
            unitHydrant.valve$.next(Number.parseInt(dataSplit[1]));
          }
          if (dataSplit[2] && dataSplit[2] !== '') {
            unitHydrant.flow$.next(Number.parseInt(dataSplit[2]));
          }
          if (dataSplit[3] && dataSplit[3] !== '') {
            unitHydrant.reading$.next(Number.parseFloat(dataSplit[3]));
          }
          if (dataSplit[4]) {
            unitHydrant.bouyLow$.next(Number.parseFloat(dataSplit[4]));
          }
          if (dataSplit[5]) {
            unitHydrant.bouyMedium$.next(Number.parseFloat(dataSplit[5]));
          }
          if (dataSplit[6]) {
            unitHydrant.bouyHight$.next(Number.parseFloat(dataSplit[6]));
          }
          if (dataSplit[7]) {
            unitHydrant.pressure$.next(Number.parseFloat(dataSplit[7]));
          }
          break;
        case '3':
          unitHydrant.unit.communication = 1;
          if (dataSplit[1]) {
            unitHydrant.unit.operator = dataSplit[1];
          }
          if (dataSplit[2]) {
            unitHydrant.unit.signal = Number.parseFloat(dataSplit[1]);
          }
          if (dataSplit[3]) {
            unitHydrant.unit.ip = dataSplit[1];
          }
          break;
        default:
      }
    }
    this.checkStatus(unitHydrant);
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
    unitHydrantWSDto.initBatch = unitHydrant.initBatch;
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

  private setMarkerColourAccourdingState(unitHydrant: UnitHydrantEntity): void {
    unitHydrant.marker
      .getElement()
      .getElementsByTagName('div')[1].style.background = this.getMarkerColour(
      unitHydrant
    );
  }

  private getMarkerColour(unitHydrant: UnitHydrantEntity): string {
    if (unitHydrant.unit.active == 1) {
      if (unitHydrant.unit.communication == 1) {
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
    if (unitHydrant.pondState$) {
      if (unitHydrant.pondState$.value === PondStateEnum.LOW) {
        return MarkerColourEnum.UNIT_POND_LOW;
      }
      if (unitHydrant.pondState$.value === PondStateEnum.MEDIUM) {
        return MarkerColourEnum.UNIT_POND_MEDIUM;
      }
      if (unitHydrant.pondState$.value === PondStateEnum.HIGTH) {
        return MarkerColourEnum.UNIT_POND_HIGTH;
      }
      if (unitHydrant.pondState$.value === PondStateEnum.ALARM) {
        return MarkerColourEnum.ALARM;
      }
    } else {
      return MarkerColourEnum.UNIT_POND_LOW;
    }
  }

  // ==================================================
  //  MQTT
  // ==================================================
  private checkStatus(unitHydrant: UnitHydrantEntity): void {
    this.checkBouysState(unitHydrant);
    this.checkBouysWarnings(unitHydrant);
    this.setMarkerColourAccourdingState(unitHydrant);
    this.setMarkerAnimationAccordingState(unitHydrant);
  }

  private checkBouysState(unitHydrant: UnitHydrantEntity): void {
    let bouysState: PondStateEnum = null;
    if (unitHydrant.bouyLow$.value == 0) {
      bouysState = PondStateEnum.LOW;
    }
    if (unitHydrant.bouyLow$.value == 1) {
      bouysState = PondStateEnum.MEDIUM;
    }
    if (unitHydrant.bouyMedium$.value == 1) {
      bouysState = PondStateEnum.HIGTH;
    }
    if (unitHydrant.bouyHight$.value == 1) {
      bouysState = PondStateEnum.ALARM;
      this._map.flyTo({ zoom: 18, animate: true, center: unitHydrant.marker.getLngLat() });
    }
    if (unitHydrant.pondState$.value !== bouysState) {
      unitHydrant.pondState$.next(bouysState);
    }
  }

  private checkBouysWarnings(unitHydrant: UnitHydrantEntity): void {
    let bouysWarnings = '';
    if (unitHydrant.bouyLow$.value == 0 && unitHydrant.bouyMedium$.value == 1) {
      bouysWarnings = 'Comprobar la boya baja';
    }
    if (
      unitHydrant.bouyLow$.value == 0 &&
      unitHydrant.bouyMedium$.value == 0 &&
      unitHydrant.bouyHight$.value == 1
    ) {
      bouysWarnings = 'Comprobar las boyas baja y media. ';
    }
    if (
      unitHydrant.bouyLow$.value == 1 &&
      unitHydrant.bouyMedium$.value == 0 &&
      unitHydrant.bouyHight$.value == 1
    ) {
      bouysWarnings = 'Comprobar las boya media. ';
    }
    if (
      (unitHydrant.bouyLow$.value == 1 &&
        unitHydrant.bouyMedium$.value == 1 &&
        unitHydrant.bouyHight$.value == 0) ||
      (unitHydrant.bouyLow$.value == 0 &&
        unitHydrant.bouyMedium$.value == 1 &&
        unitHydrant.bouyHight$.value == 0)
    ) {
      bouysWarnings = `
          ${bouysWarnings}
          En el estado "${unitHydrant.pondState$.value}" deberías tomar precaución.
          La boya de Alarma de nivel solo se puede comprobar físicamente`;
    }
    unitHydrant.bouyWarning$.next(bouysWarnings);
  }

  private setMarkerAnimationAccordingState(
    unitHydrant: UnitHydrantEntity
  ): void {
    if (unitHydrant.valve$.value == 1) {
      if (unitHydrant.bouyHight$.value == 1) {
        unitHydrant.marker.getElement().style.boxShadow =
          '0px 0px 10px 5px red';
      } else {
        unitHydrant.marker.getElement().style.boxShadow =
          '0px 0px 10px 5px green';
      }
    } else {
      unitHydrant.marker.getElement().style.boxShadow = '';
    }
  }
}
