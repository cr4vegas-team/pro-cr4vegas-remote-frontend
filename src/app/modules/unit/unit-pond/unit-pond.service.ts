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
import { UnitService } from '../unit/unit.service';
import { PopupUnitPondComponent } from './components/popup-unit-pond/popup-unit-pond.component';
import { UnitPondCreateDto } from './dto/unit-pond-create.dto';
import { UnitPondUpdateDto } from './dto/unit-pond-update.dto';
import { UnitPondEntity } from './unit-pond.entity';
import { UnitPondFactory } from './unit-pond.factory';
import { UnitPondRO, UnitsPondsRO } from './unit-pond.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UnitPondService {

  private _url: string = GLOBAL.API + 'unit-pond';

  private _unitsPonds: BehaviorSubject<UnitPondEntity[]>;

  private _map: Map;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _unitPondFactory: UnitPondFactory,
    private readonly _mapService: MapService,
    private readonly _unitService: UnitService,
    private readonly _mqttEventService: MqttEventsService,
    private readonly _matDialog: MatDialog,
    private readonly _dialogService: DialogService,
  ) {
    this._unitsPonds = new BehaviorSubject<UnitPondEntity[]>(Array<UnitPondEntity>());
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

  subscribeToHydrants(): BehaviorSubject<UnitPondEntity[]> {
    return this._unitsPonds;
  }

  updateUnitsPonds() {
    this._unitsPonds.next(this._unitsPonds.value);
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================

   async findAll() {
    const httpOptions = this._authService.getHttpOptions(false);
    await this._httpClient.get<UnitsPondsRO>(this._url, httpOptions).subscribe(
      unitsPondsRO => {
        this._unitsPonds.value.forEach(unitPond => {
          this.removeMarkerAndUnsubscribeMqtt(unitPond);
        });
        this._unitsPonds.value.splice(0);
        unitsPondsRO.unitsPonds.forEach((unitPond: UnitPondEntity) => {
          const newUnitPond: UnitPondEntity = this._unitPondFactory.createUnitPond(unitPond);
          this.addMarkerAndSubscribeMqtt(newUnitPond);
          this._unitsPonds.value.push(newUnitPond);
        });
        this.updateUnitsPonds();
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    );
  }

  async create(unitPondCreateDto: UnitPondCreateDto) {
    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.post<UnitPondRO>(this._url, unitPondCreateDto, httpOptions).subscribe(
      unitPondRO => {
        const newUnitPond: UnitPondEntity = this._unitPondFactory.createUnitPond(unitPondRO.unitPond);
        this.addMarkerAndSubscribeMqtt(newUnitPond);
        this._unitsPonds.value.push(unitPondRO.unitPond);
        this.updateUnitsPonds();
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    )
  }

  async update(unitPond: UnitPondEntity, unitPondUpdateDto: UnitPondUpdateDto) {
    console.log(unitPondUpdateDto);
    const httpOptions = this._authService.getHttpOptions(false);
    this._httpClient.put<UnitPondRO>(this._url, unitPondUpdateDto, httpOptions).subscribe(
      unitHydrantRO => {
        this._unitPondFactory.copyUnitPond(unitPond, unitHydrantRO.unitPond);
        this.addMarkerAndSubscribeMqtt(unitPond);
        this.updateUnitsPonds();
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    )
  }

  remove(unitPond: UnitPondEntity) {
    this._unitService.remove(unitPond.unit.id).subscribe(
      res => {
        if (res) {
          this.removeMarkerAndUnsubscribeMqtt(unitPond);
          unitPond.unit.active = 0;
          this.updateUnitsPonds();
        }
      },
      error => {
        this._dialogService.openDialogInfoWithAPIException(error);
      }
    );
  }

  active(unitPond: UnitPondEntity) {
    this._unitService.remove(unitPond.unit.id).subscribe(
      res => {
        if (res) {
          this.addMarkerAndSubscribeMqtt(unitPond);
          unitPond.unit.active = 1;
          this.updateUnitsPonds();
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

  getOne(id: number): UnitPondEntity {
    return this._unitsPonds.value.filter(unitPond => unitPond.id === id)[0];
  }

  // ==================================================
  // MQTT & MARKER
  // ==================================================

  addMarkersAndSubscribeMQTTAll() {
    this._unitsPonds.value.forEach(unitPond => {
      this.addMarkerAndSubscribeMqtt(unitPond);
    });
    this._unitsPonds.next(this._unitsPonds.value);
  }

  private addMarkerAndSubscribeMqtt(unitPond: UnitPondEntity) {
    unitPond.addMarker().getElement().onclick = () => this._matDialog.open(PopupUnitPondComponent, { data: unitPond });
    unitPond.marker.addTo(this._map);
    unitPond.addSubscription(this._mqttEventService.subscribe(TopicTypeEnum.UNIT_POND, unitPond.unit.code));
  }

  removeMarkersAndUnsubscribeMQTTAll() {
    this._unitsPonds.value.forEach(unitPond => {
      this.removeMarkerAndUnsubscribeMqtt(unitPond);
    });
    this._unitsPonds.next(this._unitsPonds.value);
  }

  private removeMarkerAndUnsubscribeMqtt(unitPond: UnitPondEntity) {
    unitPond.marker.remove();
    unitPond.subscription.unsubscribe();
  }

  // ==================================================
  // MAP
  // ==================================================

  private addMarkersToMap() {
    if (this._map && this._unitsPonds.value) {
      this._unitsPonds.value.forEach(unitPond => {
        this.addMarkerAndSubscribeMqtt(unitPond);
      });
    }
  }

}
