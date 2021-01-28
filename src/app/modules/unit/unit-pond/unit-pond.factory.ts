import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { UnitTypeTableEnum } from 'src/app/shared/constants/unit-type-table.enum';
import { UnitFactory } from '../unit/unit.factory';
import { MapService } from './../../../shared/services/map.service';
import { UnitPondCreateDto } from './dto/unit-pond-create.dto';
import { UnitPondUpdateDto } from './dto/unit-pond-update.dto';
import { UnitPondMqttService } from './unit-pond-mqtt.service';
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
    private readonly _unitPondMQTTService: UnitPondMqttService
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
      this._unitPondMQTTService.subscribeToMQTT(newUnitPond);
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
    point.style.backgroundColor = unitPond.getMarkerColour();
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

    unitPond.checkStatus();
  }
}
