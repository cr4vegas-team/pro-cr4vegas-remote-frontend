import { UnitGenericMqttService } from './unit-generic-mqtt.service';
import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { UnitFactory } from '../unit/unit.factory';
import { UnitTypeTableEnum } from './../../../shared/constants/unit-type-table.enum';
import { MapService } from './../../../shared/services/map.service';
import { UnitGenericCreateDto } from './dto/unit-generic-create.dto';
import { UnitGenericUpdateDto } from './dto/unit-generic-update.dto';
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
    private readonly _mapService: MapService,
    private readonly _unitGenericMQTTService: UnitGenericMqttService
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
      this._unitGenericMQTTService.subscribeToMQTT(unitGeneric);
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

  // ==================================================
  //  MARKER FUNCTIONS
  // ==================================================
  private createMarker(unitGeneric: UnitGenericEntity): void {
    if (unitGeneric.marker) {
      unitGeneric.marker.remove();
    }
    const divCode = document.createElement('div');
    divCode.classList.add('marker');
    divCode.style.display = 'block';
    divCode.style.padding = '2px';
    divCode.style.borderRadius = '5px';
    divCode.style.border = '1px solid black';
    divCode.style.backgroundColor = 'rgba(255,255,255,1)';
    divCode.style.display = 'flex';
    divCode.style.flexDirection = 'column';
    divCode.style.justifyContent = 'center';
    divCode.style.alignItems = 'center';
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
        <b>${unitGeneric.unit.sector ? unitGeneric.unit.sector.code : 'NA'} - ${unitGeneric.unit.code}</b>
    `;
    title.style.fontSize = '1em';
    title.style.display = 'none';
    title.style.textAlign = 'center';

    /* const point = document.createElement('div');
    point.style.width = '1.8em';
    point.style.height = '1.8em';
    point.style.backgroundColor = unitGeneric.getMarkerColour();
    point.style.margin = '0px auto';
    point.style.borderTopLeftRadius = '50%';
    point.style.borderTopRightRadius = '50%';
    point.style.borderBottomRightRadius = '50%'; */

    const point = document.createElement('div');
    point.innerHTML = '<span class="fas fa-dot-circle" style="width: 1.8em; height: 1.8em"></span>';
    point.style.width = '1.8em';
    point.style.height = '1.8em';
    point.style.display = 'flex';
    point.style.flexFlow = 'row wrap';
    point.style.justifyContent = 'center';
    point.style.alignItems = 'center';
    point.style.color = unitGeneric.getMarkerColour();

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
}
