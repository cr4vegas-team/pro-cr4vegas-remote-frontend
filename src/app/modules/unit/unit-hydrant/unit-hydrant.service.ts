import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Map } from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { DialogInfoComponent } from 'src/app/shared/components/dialog-info/dialog-info.component';
import { GLOBAL } from '../../../shared/constants/global.constant';
import { TopicTypeEnum } from '../../../shared/constants/topic-type.enum';
import { AuthService } from '../../../shared/services/auth.service';
import { MapService } from '../../../shared/services/map.service';
import { MqttEventsService } from '../../../shared/services/mqtt-events.service';
import { UnitService } from '../unit/unit.service';
import { PopupUnitHydrantComponent } from './components/popup-unit-hydrant/popup-unit-hydrant.component';
import { UnitHydrantCreateDto } from './dto/unit-hydrant-create.dto';
import { UnitHydrantUpdateDto } from './dto/unit-hydrant-update.dto';
import { UnitHydrantEntity } from './unit-hydrant.entity';
import { UnitHydrantFactory } from './unit-hydrant.factory';
import { UnitHydrantRO, UnitsHydrantsRO } from './unit-hydrant.interfaces';


@Injectable({
  providedIn: 'root',
})
export class UnitHydrantService {

  private _url: string = GLOBAL.API + 'unit-hydrant';

  private _unitsHydrants: BehaviorSubject<UnitHydrantEntity[]>;

  private _map: Map;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _unitHydrantFactory: UnitHydrantFactory,
    private readonly _mapService: MapService,
    private readonly _unitService: UnitService,
    private readonly _mqttEventService: MqttEventsService,
    private readonly _matDialog: MatDialog,
  ) {
    this._unitsHydrants = new BehaviorSubject<UnitHydrantEntity[]>(Array<UnitHydrantEntity>());
    this._mapService.getMap().subscribe(
      (map: Map) => {
        if (map) {
          this._map = map;
          this.addMarkersToMap();
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

  subscribeToHydrants(): BehaviorSubject<UnitHydrantEntity[]> {
    return this._unitsHydrants;
  }

  updateUnitsHydrants() {
    this._unitsHydrants.next(this._unitsHydrants.value);
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

  private async findAll(active?: number) {
    const httpOptions = this._authService.getHttpOptions(active ? true : false);
    active ? httpOptions.params.set('active', active.toString()) : '';
    await this._httpClient.get<UnitsHydrantsRO>(this._url, httpOptions).subscribe(
      unitsHydrantsRO => {
        this._unitsHydrants.value.forEach(unitHydrant => {
          this.removeMarkerAndUnsubscribeMqtt(unitHydrant);
        });
        this._unitsHydrants.value.splice(0);
        unitsHydrantsRO.unitsHydrants.forEach((unitHydrant: UnitHydrantEntity) => {
          const newUnitHydrant: UnitHydrantEntity = this._unitHydrantFactory.createUnitHydrant(unitHydrant);
          this.addMarkerAndSubscribeMqtt(newUnitHydrant);
          this._unitsHydrants.value.push(newUnitHydrant);
        });
        this.updateUnitsHydrants();
      },
      error => {
        this._matDialog.open(DialogInfoComponent, { data: error.message });
      }
    );
  }

  async create(unitHydrant: UnitHydrantEntity) {

    const unitHydrantCreateDto: UnitHydrantCreateDto = this._unitHydrantFactory.getUnitHydrantCreateDto(unitHydrant);

    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.post<UnitHydrantRO>(this._url, unitHydrantCreateDto, httpOptions).subscribe(
      unitHydrantRO => {
        const newUnitHydrant: UnitHydrantEntity = this._unitHydrantFactory.createUnitHydrant(unitHydrantRO.unitHydrant);
        this.addMarkerAndSubscribeMqtt(newUnitHydrant);
        this._unitsHydrants.value.push(newUnitHydrant);
        this.updateUnitsHydrants();
      },
      error => {
        this._matDialog.open(DialogInfoComponent, { data: error.message });
      }
    )
  }

  async update(unitHydrant: UnitHydrantEntity, updateHydrant: UnitHydrantEntity) {

    const unitHydrantUpdateDto: UnitHydrantUpdateDto = this._unitHydrantFactory.getUnitHydrantUpdateDto(updateHydrant);
    
    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.put<UnitHydrantRO>(this._url, unitHydrantUpdateDto, httpOptions).subscribe(
      unitHydrantRO => {
        this._unitHydrantFactory.copyUnitHydrant(unitHydrant, unitHydrantRO.unitHydrant);
        this.addMarkerAndSubscribeMqtt(unitHydrant);
        this.updateUnitsHydrants();
      },
      error => {
        this._matDialog.open(DialogInfoComponent, { data: error.message });
      }
    )
  }

  remove(unitHydrant: UnitHydrantEntity) {
    this._unitService.remove(unitHydrant.unit.id).subscribe(
      res => {
        if (res) {
          this.removeMarkerAndUnsubscribeMqtt(unitHydrant);
          unitHydrant.unit.active = 0;
          this.updateUnitsHydrants();
        }
      }
    );
  }

  active(unitHydrant: UnitHydrantEntity) {
    this._unitService.remove(unitHydrant.unit.id).subscribe(
      res => {
        if (res) {
          this.addMarkerAndSubscribeMqtt(unitHydrant);
          unitHydrant.unit.active = 1;
          this.updateUnitsHydrants();
        }
      }
    );
  }

  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================

  getOne(id: number): UnitHydrantEntity {
    return this._unitsHydrants.value.filter(unitHydrant => unitHydrant.id === id)[0];
  }

  // ==================================================
  // MQTT & MARKER
  // ==================================================

  addMarkersAndSubscribeMQTTAll() {
    this._unitsHydrants.value.forEach(unitHydrant => {
      this.addMarkerAndSubscribeMqtt(unitHydrant);
    });
    this._unitsHydrants.next(this._unitsHydrants.value);
  }

  private addMarkerAndSubscribeMqtt(unitHydrant: UnitHydrantEntity) {
    unitHydrant.addMarker().getElement().onclick = () => this._matDialog.open(PopupUnitHydrantComponent, { data: unitHydrant });
    unitHydrant.marker.addTo(this._map);
    unitHydrant.addSubscription(this._mqttEventService.subscribe(TopicTypeEnum.UNIT_HYDRANT, unitHydrant.unit.code));
  }

  removeMarkersAndUnsubscribeMQTTAll() {
    this._unitsHydrants.value.forEach(unitHydrant => {
      this.removeMarkerAndUnsubscribeMqtt(unitHydrant);
    });
    this._unitsHydrants.next(this._unitsHydrants.value);
  }

  private removeMarkerAndUnsubscribeMqtt(unitHydrant: UnitHydrantEntity) {
    unitHydrant.marker.remove();
    unitHydrant.subscription.unsubscribe();
  }

  // ==================================================
  // MAP
  // ==================================================

  private addMarkersToMap() {
    if (this._map && this._unitsHydrants.value) {
      this._unitsHydrants.value.forEach(unitHydrant => {
        this.addMarkerAndSubscribeMqtt(unitHydrant);
      });
    }
  }

}
