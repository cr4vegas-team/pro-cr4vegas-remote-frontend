import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { UnitFactory } from '../unit/unit.factory';
import { UnitTypeTableEnum } from './../../../shared/constants/unit-type-table.enum';
import { MapService } from './../../../shared/services/map.service';
import { UnitGenericCreateDto } from './dto/unit-generic-create.dto';
import { UnitGenericUpdateDto } from './dto/unit-generic-update.dto';
import { UnitGenericWSDto } from './dto/unit-generic-ws.dto';
import { UnitGenericEntity } from './unit-generic.entity';

@Injectable({
  providedIn: 'root',
})
export class UnitGenericFactory {
  // ==================================================
  //  VARS
  // ==================================================
  private _map: Map;

  // ==================================================
  //  VARS SUBJECTS
  // ==================================================
  private _markerChange$ = new BehaviorSubject<UnitGenericEntity>(null);

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

  public getMarkerChange(): BehaviorSubject<UnitGenericEntity> {
    return this._markerChange$;
  }

  // ==================================================
  //  FACTORY FUNCTIONS
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
      newUnitGeneric.unit.unitTypeTable = UnitTypeTableEnum.UNIT_GENERIC;
      this.createMarker(newUnitGeneric);
    }
    return newUnitGeneric;
  }

  public copyUnitGeneric(target: UnitGenericEntity, source: any): void {
    target.data1 = source.data1;
    target.data2 = source.data2;
    target.data3 = source.data3;
    target.data4 = source.data4;
    target.data5 = source.data5;
    target.unit = this._unitFactory.updateUnit(target.unit, source.unit);
    this.createMarker(target);
  }

  public updateProperties(
    unitGeneric: UnitGenericEntity,
    topicMessage: string
  ): void {
    if (unitGeneric.nodeSubscription) {
      unitGeneric.nodeSubscription.unsubscribe();
    }
    const dataSplit: string[] = topicMessage.split(',');
    if (dataSplit.length > 0) {
      switch (dataSplit[0]) {
        case '0':
          unitGeneric.unit.communication = 0;
          break;
        case '1':
          unitGeneric.unit.communication = 1;
          break;
        case '2':
          if (dataSplit[1]) {
            unitGeneric.property1$.next(Number.parseFloat(dataSplit[1]));
          }
          if (dataSplit[2]) {
            unitGeneric.property1$.next(Number.parseFloat(dataSplit[2]));
          }
          if (dataSplit[3]) {
            unitGeneric.property1$.next(Number.parseFloat(dataSplit[3]));
          }
          if (dataSplit[4]) {
            unitGeneric.property1$.next(Number.parseFloat(dataSplit[4]));
          }
          if (dataSplit[5]) {
            unitGeneric.property1$.next(Number.parseFloat(dataSplit[5]));
          }
          break;
        case '3':
          if (dataSplit[1]) {
            unitGeneric.unit.operator = dataSplit[1];
          }
          if (dataSplit[2]) {
            unitGeneric.unit.signal = Number.parseFloat(dataSplit[1]);
          }
          if (dataSplit[3]) {
            unitGeneric.unit.ip = dataSplit[1];
          }
          break;
        default:
      }
    }
    this.setMarkerColourAccourdingState(unitGeneric);
  }

  // ==================================================
  //  DTO FUNCTIONS
  // ==================================================
  public getUnitGenericCreateDto(unitGeneric: any): UnitGenericCreateDto {
    const unitGenericCreateDto: UnitGenericCreateDto = new UnitGenericCreateDto();
    unitGenericCreateDto.data1 = unitGeneric.data1;
    unitGenericCreateDto.data2 = unitGeneric.data2;
    unitGenericCreateDto.data3 = unitGeneric.data3;
    unitGenericCreateDto.data4 = unitGeneric.data4;
    unitGenericCreateDto.data5 = unitGeneric.data5;
    unitGenericCreateDto.unit = this._unitFactory.getUnitCreateDto(
      unitGeneric.unit
    );
    unitGenericCreateDto.unit.unitTypeTable = UnitTypeTableEnum.UNIT_GENERIC;
    return unitGenericCreateDto;
  }

  public getUnitGenericUpdateDto(unitGeneric: any): UnitGenericUpdateDto {
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

  public getUnitGenericWSDto(unitGeneric: any): UnitGenericWSDto {
    const unitGenericWSDto: UnitGenericWSDto = new UnitGenericWSDto();
    unitGenericWSDto.id = unitGeneric.id;
    unitGenericWSDto.data1 = unitGeneric.data1;
    unitGenericWSDto.data2 = unitGeneric.data2;
    unitGenericWSDto.data3 = unitGeneric.data3;
    unitGenericWSDto.data4 = unitGeneric.data4;
    unitGenericWSDto.data5 = unitGeneric.data5;
    unitGenericWSDto.unit = this._unitFactory.getUnitWSDto(unitGeneric.unit);
    return unitGenericWSDto;
  }

  // ==================================================
  //  MARKER FUNCTIONS
  // ==================================================
  private createMarker(unitGeneric: UnitGenericEntity): void {
    if (unitGeneric.marker) {
      unitGeneric.marker.remove();
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
        Genérico<br>
        <b>${unitGeneric.unit.sector.code} - ${unitGeneric.unit.code}</b>
    `;
    title.style.fontSize = '1em';
    title.style.display = 'none';
    title.style.textAlign = 'center';

    const point = document.createElement('div');
    point.style.width = '1.8em';
    point.style.height = '1.8em';
    point.style.backgroundColor = this.getMarkerColour(unitGeneric);
    point.style.margin = '0px auto';
    point.style.borderTopLeftRadius = '50%';
    point.style.borderTopRightRadius = '50%';
    point.style.borderBottomRightRadius = '50%';
    divCode.appendChild(title);
    divCode.appendChild(point);

    unitGeneric.marker = new Marker(divCode, {}).setLngLat([
      unitGeneric.unit.longitude,
      unitGeneric.unit.latitude,
    ]);

    this._markerChange$.next(unitGeneric);
    if (this._map) {
      unitGeneric.marker.addTo(this._map);
    }
  }

  private setMarkerColourAccourdingState(unitGeneric: UnitGenericEntity): void {
    unitGeneric.marker
      .getElement()
      .getElementsByTagName(
        'div'
      )[1].style.backgroundColor = this.getMarkerColour(unitGeneric);
  }

  private getMarkerColour(unitGEneric: UnitGenericEntity): string {
    if (unitGEneric.unit.active) {
      if (unitGEneric.unit.communication) {
        return MarkerColourEnum.UNIT;
      } else {
        return MarkerColourEnum.WITHOUT_COMMUNICATION;
      }
    } else {
      return MarkerColourEnum.INACTIVE;
    }
  }
}
