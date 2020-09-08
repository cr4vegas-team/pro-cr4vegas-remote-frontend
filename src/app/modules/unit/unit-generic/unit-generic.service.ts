import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Map } from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { TopicTypeEnum } from '../../../shared/constants/topic-type.enum';
import { AuthService } from '../../../shared/services/auth.service';
import { MapService } from '../../../shared/services/map.service';
import { MqttEventsService } from '../../../shared/services/mqtt-events.service';
import { UnitGenericFactory } from '../unit-generic/unit-generic.factory';
import { UnitService } from '../unit/unit.service';
import { PopupUnitGenericComponent } from './components/popup-unit-generic/popup-unit-generic.component';
import { UnitGenericCreateDto } from './dto/unit-generic-create.dto';
import { UnitGenericUpdateDto } from './dto/unit-generic-update.dto';
import { UnitGenericEntity } from './unit-generic.entity';
import { UnitGenericRo, UnitsGenericsRO } from './unit-generic.interfaces';


@Injectable({
  providedIn: 'root',
  deps: [AuthService]
})
export class UnitGenericService {

  private _url: string = GLOBAL.API + 'unit-generic';

  private _unitsGenerics: BehaviorSubject<UnitGenericEntity[]>;
  private _map: Map;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _unitGenericFactory: UnitGenericFactory,
    private readonly _mapService: MapService,
    private readonly _unitService: UnitService,
    private readonly _mqttEventService: MqttEventsService,
    private readonly _matDialog: MatDialog,
    private readonly _dialogService: DialogService, 
  ) {
    this._unitsGenerics = new BehaviorSubject<UnitGenericEntity[]>(Array<UnitGenericEntity>());
    this._mapService.getMap().subscribe(
      (map: Map) => {
        if (map) {
          this._map = map;
          this.setMapToUnitsGenerics();
        }
      }
    );
    this._authService.observeAuthenticated().subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this.findAll();
        }
      }
    );
  }

  subscribeToUnitsGenerics(): BehaviorSubject<UnitGenericEntity[]> {
    return this._unitsGenerics;
  }

  updateUnitsGenerics() {
    this._unitsGenerics.next(this._unitsGenerics.value);
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

  async findAll() {
    const httpOptions = this._authService.getHttpOptions(false);
    await this._httpClient.get<UnitsGenericsRO>(this._url, httpOptions).subscribe(
      unitsGenericsRO => {
        this._unitsGenerics.value.forEach(unitGeneric => {
          this.removeMarkersAndUnsubscribeMqtt(unitGeneric);
        });
        this._unitsGenerics.value.splice(0);
        unitsGenericsRO.unitsGenerics.forEach((unitGeneric: UnitGenericEntity) => {
          const newUnitGeneric: UnitGenericEntity = this._unitGenericFactory.createUnitGeneric(unitGeneric);
          this.addMarkerAndSubscribeMqtt(newUnitGeneric);
          this._unitsGenerics.value.push(newUnitGeneric);
        });
        this.updateUnitsGenerics();
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    );
  }

  async create(unitGenericCreateDto: UnitGenericCreateDto) {
    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.post<UnitGenericRo>(this._url, unitGenericCreateDto, httpOptions).subscribe(
      unitGenericRO => {
        const newUnitGeneric: UnitGenericEntity = this._unitGenericFactory.createUnitGeneric(unitGenericRO.unitGeneric);
        this.addMarkerAndSubscribeMqtt(newUnitGeneric);
        this._unitsGenerics.value.push(newUnitGeneric);
        this.updateUnitsGenerics();
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    )
  }

  async update(unitGeneric: UnitGenericEntity, unitGenericUpdateDto: UnitGenericUpdateDto) {
    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.put<UnitGenericRo>(this._url, unitGenericUpdateDto, httpOptions).subscribe(
      unitGenericRO => {
        this._unitGenericFactory.copyUnitGeneric(unitGeneric, unitGenericRO.unitGeneric);
        this.addMarkerAndSubscribeMqtt(unitGeneric);
        this.updateUnitsGenerics();
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    )
  }

  remove(unitGeneric: UnitGenericEntity) {
    this._unitService.remove(unitGeneric.unit.id).subscribe(
      res => {
        if (res) {
          this.removeMarkersAndUnsubscribeMqtt(unitGeneric);
          unitGeneric.unit.active = 0;
          this.updateUnitsGenerics();
        }
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    );
  }

  active(unitGeneric: UnitGenericEntity) {
    this._unitService.remove(unitGeneric.unit.id).subscribe(
      res => {
        if (res) {
          this.addMarkerAndSubscribeMqtt(unitGeneric);
          unitGeneric.unit.active = 1;
          this.updateUnitsGenerics();
        }
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    );
  }

  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================

  getOne(id: number): UnitGenericEntity {
    return this._unitsGenerics.value.filter(unitGeneric => unitGeneric.id === id)[0];
  }

  // ==================================================
  // Marker & MQTT
  // ==================================================

  addMarkersAndSubscribeMQTTAll() {
    this._unitsGenerics.value.forEach(unitGeneric => {
      this.addMarkerAndSubscribeMqtt(unitGeneric);
    });
    this._unitsGenerics.next(this._unitsGenerics.value);
  }

  private addMarkerAndSubscribeMqtt(unitGeneric: UnitGenericEntity) {
    unitGeneric.addMarker().getElement().onclick = () => this._matDialog.open(PopupUnitGenericComponent, { data: unitGeneric });
    unitGeneric.marker.addTo(this._map);
    unitGeneric.addSubscription(this._mqttEventService.subscribe(TopicTypeEnum.UNIT_GENERIC, unitGeneric.unit.code));
  }

  removeMarkersAndUnsubscribeMQTTAll() {
    this._unitsGenerics.value.forEach(unitGeneric => {
      this.removeMarkersAndUnsubscribeMqtt(unitGeneric);
    });
    this._unitsGenerics.next(this._unitsGenerics.value);
  }

  private removeMarkersAndUnsubscribeMqtt(unitGeneric: UnitGenericEntity) {
    unitGeneric.marker.remove();
    unitGeneric.subscription.unsubscribe();
  }

  // ==================================================
  // MAP
  // ==================================================

  private setMapToUnitsGenerics() {
    if (this._map && this._unitsGenerics.value) {
      this._unitsGenerics.value.forEach(unitGeneric => {
        this.addMarkerAndSubscribeMqtt(unitGeneric);
      });
    }
  }

}
