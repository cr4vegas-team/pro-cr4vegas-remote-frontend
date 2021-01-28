import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { UnitTypeTableEnum } from 'src/app/shared/constants/unit-type-table.enum';
import { UnitFactory } from '../unit/unit.factory';
import { MapService } from './../../../shared/services/map.service';
import { UnitHydrantCreateDto } from './dto/unit-hydrant-create.dto';
import { UnitHydrantUpdateDto } from './dto/unit-hydrant-update.dto';
import { UnitHydrantMqttService } from './unit-hydrant-mqtt.service';
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
    private readonly _mapService: MapService,
    private readonly _unitHydrantMQTTService: UnitHydrantMqttService
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
      this._unitHydrantMQTTService.subscribeToTopicsMQTT(newUnitHydrant);
    }
    newUnitHydrant.checkStatus();
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
    target.checkStatus();
  }

  // ==================================================
  //  DTO FUNCTIONS
  // ==================================================
  public getUnitHydrantCreateDto(unitHydrant: any): UnitHydrantCreateDto {
    const unitHydrantCreateDto: UnitHydrantCreateDto = new UnitHydrantCreateDto();
    unitHydrantCreateDto.filter = unitHydrant.filter;
    unitHydrantCreateDto.diameter = unitHydrant.diameter;
    unitHydrantCreateDto.initBatch = unitHydrant.initBatch;
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
    unitHydrantUpdateDto.initBatch = unitHydrant.initBatch;
    unitHydrantUpdateDto.unit = this._unitFactory.getUnitUpdateDto(
      unitHydrant.unit
    );
    return unitHydrantUpdateDto;
  }

  // ==================================================
  //  MARKER FUNCTIONS
  // ==================================================
  private createMarker(unitHydrant: UnitHydrantEntity): void {
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
    point.style.backgroundColor = unitHydrant.getMarkerColour();
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
}
