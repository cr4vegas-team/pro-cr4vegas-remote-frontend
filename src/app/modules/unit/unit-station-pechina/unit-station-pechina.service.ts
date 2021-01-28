import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GLOBAL } from 'src/app/shared/constants/global.constant';
import { MapService } from 'src/app/shared/services/map.service';
import { AuthService } from '../../auth/auth/auth.service';
import { UnitStationPechinaUpdateDto } from './dto/unit-station-pechina-update.dto';
import { UnitStationPechinaFactoryService } from './unit-station-pechina-factory.service';
import { UnitStationPechinaEntity } from './unit-station-pechina.entity';

@Injectable({
  providedIn: 'root',
})
export class UnitStationPechinaService implements OnDestroy {
  // ==================================================
  //  VARS CONSTANTS
  // ==================================================
  private _url: string = GLOBAL.API + 'unit-station-pechina';

  // ==================================================
  //  VARS SUBSJECTS
  // ==================================================
  private _unitStationPechina: BehaviorSubject<UnitStationPechinaEntity>;
  private _hiddenMarker = new BehaviorSubject<boolean>(false);

  // ==================================================
  //  VARS SUBSCRIPTIONS
  // ==================================================
  private _subMap: Subscription;
  private _subHiddenMarker: Subscription;

  // ==================================================
  //  CONSTRUCTOR
  // ==================================================
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _mapService: MapService,
    private readonly _unitStationPechinaFactoryService: UnitStationPechinaFactoryService
  ) {
    this._unitStationPechina = new BehaviorSubject<UnitStationPechinaEntity>(
      null
    );
    this.subscribeToMap();
    this.subscribeToHiddenMarker();
  }

  // ==================================================
  //  SUBSCRIPTIONS FUNCTIONS
  // ==================================================
  private subscribeToMap(): void {
    this._subMap = this._mapService.map.subscribe((map) => {
      if (map !== null) {
        if (this._unitStationPechina.value) {
          this._unitStationPechina.value.marker.addTo(map);
        }
      }
    });
  }

  private subscribeToHiddenMarker(): void {
    this._subHiddenMarker = this._hiddenMarker.subscribe((hidden) => {
      if (
        this._unitStationPechina.value &&
        this._unitStationPechina.value.marker
      ) {
        this._unitStationPechina.value.marker.getElement().hidden = hidden;
      }
    });
  }

  // ==================================================
  // API FUNCTIONS
  // ==================================================
  public find(): void {
    const httpOptions = this._authService.getHttpOptions({});
    this._httpClient
      .get<UnitStationPechinaEntity>(this._url, httpOptions)
      .subscribe(
        (unitStationPechina) => {
          this.clean();
          if (unitStationPechina) {
            const newUnitStationPechina = this._unitStationPechinaFactoryService.createUnitStationPechina(
              unitStationPechina
            );
            this._unitStationPechina.next(newUnitStationPechina);
          }
        },
        (error) => {
          throw new Error(error);
        }
      );
  }

  update(
    unitStationPechinaUpdateDto: UnitStationPechinaUpdateDto
  ): Observable<UnitStationPechinaEntity> {
    const httpOptions = this._authService.getHttpOptions({});
    return this._httpClient.put<UnitStationPechinaEntity>(
      this._url,
      unitStationPechinaUpdateDto,
      httpOptions
    );
  }

  // ==================================================
  // FRONTEND FUNCTIONS
  // ==================================================
  public getUnitStationPechina(): BehaviorSubject<UnitStationPechinaEntity> {
    return this._unitStationPechina;
  }

  public refresh(): void {
    this._unitStationPechina.next(this._unitStationPechina.value);
  }

  public getHiddenMarker(): BehaviorSubject<boolean> {
    return this._hiddenMarker;
  }

  public clean(): void {
    if (this._unitStationPechina && this._unitStationPechina.value) {
      if (this._unitStationPechina.value.marker) {
        this._unitStationPechina.value.marker.remove();
      }
      if (this._unitStationPechina.value.mqttNodeSubscription) {
        this._unitStationPechina.value.mqttNodeSubscription.unsubscribe();
      }
    }
  }

  // ==================================================
  //  WS FUNCTIONS
  // ==================================================
  public updateWS(unitStationPechina: any): void {
    this._unitStationPechinaFactoryService.copyUnitStationPechina(
      this._unitStationPechina.value,
      unitStationPechina
    );
    this.refresh();
  }

  // ==================================================
  //  LIFE CYCLE FUNCTIONS
  // ==================================================
  ngOnDestroy(): void {
    if (this._subMap) {
      this._subMap.unsubscribe();
    }
    if (this._subHiddenMarker) {
      this._subHiddenMarker.unsubscribe();
    }
  }
}
