import { UnitGenericService } from 'src/app/modules/unit/unit-generic/unit-generic.service';
import { UnitTypeTableEnum } from './../../../shared/constants/unit-type-table.enum';
import { UnitGenericWSDto } from './dto/unit-generic-ws.dto';
import { MapService } from './../../../shared/services/map.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Marker, Map } from 'mapbox-gl';
import { IMqttMessage } from 'ngx-mqtt';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { TopicDestinationEnum } from 'src/app/shared/constants/topic-destination.enum';
import { TopicTypeEnum } from 'src/app/shared/constants/topic-type.enum';
import { MqttEventsService } from 'src/app/shared/services/mqtt-events.service';
import { UnitFactory } from '../unit/unit.factory';
import { UnitGenericCreateDto } from './dto/unit-generic-create.dto';
import { UnitGenericUpdateDto } from './dto/unit-generic-update.dto';
import { UnitGenericEntity } from './unit-generic.entity';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnitGenericFactory implements OnDestroy {
  // ==================================================
  //  VARS
  // ==================================================
  private _map: Map;

  // ==================================================
  //  VARS SUBJECTS
  // ==================================================
  private _markerChange$ = new BehaviorSubject<UnitGenericEntity>(null);

  private _subServerUpdate: Subscription;
  private _subServerCreate: Subscription;

  constructor(
    private readonly _unitFactory: UnitFactory,
    private readonly _mqttEventService: MqttEventsService,
    private readonly _mapService: MapService,
    private readonly _unitGenericService: UnitGenericService
  ) {
    this._mapService.map.subscribe((map) => {
      if (map) {
        this._map = map;
      }
    });
    this.subscribeToServerCreate();
    this.subscribeToServerUpdate();
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
      this.subscribeToNode(newUnitGeneric);
    }
    return newUnitGeneric;
  }

  public updateUnitGeneric(target: UnitGenericEntity, source: any): void {
    target.data1 = source.data1;
    target.data2 = source.data2;
    target.data3 = source.data3;
    target.data4 = source.data4;
    target.data5 = source.data5;
    target.unit = this._unitFactory.updateUnit(target.unit, source.unit);
    this.createMarker(target);
    this.subscribeToNode(target);
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

  public setMarkerState(unitGeneric: UnitGenericEntity): void {
    this.setMarkerColourAccourdingState(unitGeneric);
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

  // ==================================================
  //  MQTT
  // ==================================================

  // ----------------------------
  //  NODE SUBSCRIPTION
  // ----------------------------
  private subscribeToNode(unitGeneric: UnitGenericEntity): void {
    if (unitGeneric.nodeSubscription) {
      unitGeneric.nodeSubscription.unsubscribe();
    }
    const observable = this._mqttEventService.observerWithID(
      TopicDestinationEnum.NODE,
      TopicTypeEnum.UNIT_GENERIC,
      unitGeneric.id
    );
    unitGeneric.nodeSubscription = observable.subscribe(
      (data: IMqttMessage) => {
        const dataSplit: string[] = data.payload.toString().split(',');
        if (dataSplit.length > 0) {
          if (dataSplit[0].match(/[0123456789]/)) {
            unitGeneric.unit.communication = 1;
            unitGeneric.unit.received = 1;
          }
          if (dataSplit[1]) {
            unitGeneric.property1$.next(dataSplit[1]);
          }
          if (dataSplit[2]) {
            unitGeneric.property2$.next(dataSplit[2]);
          }
          if (dataSplit[3]) {
            unitGeneric.property3$.next(dataSplit[3]);
          }
          if (dataSplit[4]) {
            unitGeneric.property4$.next(dataSplit[4]);
          }
          if (dataSplit[5]) {
            unitGeneric.property5$.next(dataSplit[5]);
          }
        }
        this.setMarkerColourAccourdingState(unitGeneric);
      }
    );
  }
  private subscribeToServerCreate(): void {
    this._subServerCreate = this._mqttEventService
      .observe(
        TopicDestinationEnum.SERVER_DATA_CREATE,
        TopicTypeEnum.UNIT_GENERIC
      )
      .subscribe((data: IMqttMessage) => {
        const unitGenericWSDto = JSON.parse(data.payload.toString());
        const foundedUnitsGenerics = this._unitGenericService
          .getUnitsGeneric()
          .value.filter(
            (unitGeneric) => unitGeneric.id === unitGenericWSDto.id
          );
        if (foundedUnitsGenerics.length === 0) {
          const newUnitGeneric = this.createUnitGeneric(unitGenericWSDto);
          this._unitGenericService.getUnitsGeneric().value.push(newUnitGeneric);
          this._unitGenericService.refresh();
        }
      });
  }

  private subscribeToServerUpdate(): void {
    this._subServerUpdate = this._mqttEventService
      .observe(
        TopicDestinationEnum.SERVER_DATA_UPDATE,
        TopicTypeEnum.UNIT_GENERIC
      )
      .subscribe((data: IMqttMessage) => {
        const unitGenericWSDto = JSON.parse(data.payload.toString());
        const foundedUnitsGenerics = this._unitGenericService
          .getUnitsGeneric()
          .value.filter(
            (unitGeneric) => unitGeneric.id === unitGenericWSDto.id
          );
        if (foundedUnitsGenerics.length > 0) {
          const foundedUnitGeneric = foundedUnitsGenerics[0];
          this.updateUnitGeneric(foundedUnitGeneric, unitGenericWSDto);
          this._unitGenericService.refresh();
        }
      });
  }

  ngOnDestroy(): void {
    if (this._subServerCreate) {
      this._subServerCreate.unsubscribe();
    }
    if (this._subServerUpdate) {
      this._subServerUpdate.unsubscribe();
    }
  }
}
