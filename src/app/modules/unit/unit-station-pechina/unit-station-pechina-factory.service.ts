import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { UnitTypeTableEnum } from 'src/app/shared/constants/unit-type-table.enum';
import { MapService } from 'src/app/shared/services/map.service';
import { UnitFactory } from '../unit/unit.factory';
import { UnitStationPechinaUpdateDto } from './dto/unit-station-pechina-update.dto';
import { UnitStationPechinaMqttService } from './unit-station-pechina-mqtt.service';
import { UnitStationPechinaEntity } from './unit-station-pechina.entity';

@Injectable({
  providedIn: 'root',
})
export class UnitStationPechinaFactoryService {
  // ==================================================
  //  VARS
  // ==================================================
  private _map: Map;

  // ==================================================
  //  VARS SUBJECTS
  // ==================================================
  private _markerChange$ = new BehaviorSubject<UnitStationPechinaEntity>(null);

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _unitFactory: UnitFactory,
    private readonly _mapService: MapService,
    private readonly _unitStationPechinaMQTTService: UnitStationPechinaMqttService
  ) {
    this._mapService.map.subscribe((map) => {
      if (map) {
        this._map = map;
      }
    });
  }

  public getMarkerChange(): BehaviorSubject<UnitStationPechinaEntity> {
    return this._markerChange$;
  }

  // ==================================================
  //  FACTORY FUNCTIONS
  // ==================================================
  public createUnitStationPechina(
    unitStationPechina: any
  ): UnitStationPechinaEntity {
    const newUnitStationPechina: UnitStationPechinaEntity = new UnitStationPechinaEntity();
    if (unitStationPechina) {
      newUnitStationPechina.id = unitStationPechina.id;
      newUnitStationPechina.readingBatch = unitStationPechina.readingBatch;
      newUnitStationPechina.unit = this._unitFactory.createUnit(
        unitStationPechina.unit
      );
      newUnitStationPechina.unit.unitTypeTable =
        UnitTypeTableEnum.UNIT_STATION_PECHINA;
      this.createMarker(newUnitStationPechina);
      this._unitStationPechinaMQTTService.subscribeToMQTT(
        newUnitStationPechina
      );
    }
    return newUnitStationPechina;
  }

  public copyUnitStationPechina(
    target: UnitStationPechinaEntity,
    source: UnitStationPechinaEntity
  ): void {
    target.readingBatch = source.readingBatch;
    target.unit = this._unitFactory.createUnit(source.unit);
    target.marker.setLngLat([target.unit.longitude, target.unit.latitude]);
    this.createMarker(target);
  }

  // ==================================================
  //  DTO FUNCTIONS
  // ==================================================
  public getUnitStationUpdateDto(
    unitStationPechina: any
  ): UnitStationPechinaUpdateDto {
    const unitStationPechinaDto: UnitStationPechinaUpdateDto = new UnitStationPechinaUpdateDto();
    unitStationPechinaDto.id = unitStationPechina.id;
    unitStationPechinaDto.readingBatch = unitStationPechina.readingBatch;
    unitStationPechinaDto.unit = this._unitFactory.getUnitUpdateDto(
      unitStationPechina.unit
    );
    return unitStationPechinaDto;
  }

  // ==================================================
  //  MARKER FUNCTIONS
  // ==================================================
  private createMarker(unitStationPechina: UnitStationPechinaEntity): void {
    if (unitStationPechina.marker) {
      unitStationPechina.marker.remove();
    }
    const divCode = document.createElement('div');
    divCode.classList.add('marker');
    divCode.style.padding = '3px';
    divCode.style.borderRadius = '10px';
    divCode.style.border = '1px solid black';
    divCode.style.backgroundColor = 'rgba(255,255,255,0.8)';
    divCode.style.display = 'flex';
    divCode.style.flexDirection = 'column';
    divCode.style.justifyContent = 'center';
    divCode.style.alignItems = 'center';
    divCode.onmouseover = () => {
      (divCode.children[0] as HTMLElement).style.display = 'block';
      divCode.style.width = '100px';
      divCode.style.height = '100px';
      divCode.style.zIndex = '2';
    };
    divCode.onmouseleave = () => {
      (divCode.children[0] as HTMLElement).style.display = 'none';
      divCode.style.width = 'min-content';
      divCode.style.height = 'min-content';
      divCode.style.zIndex = '1';
    };

    const title = document.createElement('div');
    title.innerHTML = `Estación<br><b>${unitStationPechina.unit.name}</b>`;
    title.style.fontSize = '1em';
    title.style.textAlign = 'center';
    title.style.padding = '1px';
    title.style.borderRadius = '5px';
    title.style.display = 'none';

    /* const point = document.createElement('div');
    point.style.width = '2.0em';
    point.style.height = '2.0em';
    point.style.backgroundColor = MarkerColourEnum.STATION;
    point.style.margin = '1px auto';
    point.style.borderRadius = '2px'; */

    // <span class="unit-icon fas fa-home"></span>
    const point = document.createElement('div');
    point.innerHTML = '<span class="icon-map fas fa-home" style="width: 2em; height: 2em"></span>';
    point.style.width = '2em';
    point.style.height = '2em';
    point.style.display = 'flex';
    point.style.flexFlow = 'row wrap';
    point.style.justifyContent = 'center';
    point.style.alignItems = 'center';
    point.style.color = MarkerColourEnum.STATION;

    divCode.appendChild(title);
    divCode.appendChild(point);

    unitStationPechina.marker = new Marker(divCode, {}).setLngLat([
      unitStationPechina.unit.longitude,
      unitStationPechina.unit.latitude,
    ]);

    this._markerChange$.next(unitStationPechina);
    if (this._map) {
      unitStationPechina.marker.addTo(this._map);
    }

    unitStationPechina.checkStatus();
  }
}
