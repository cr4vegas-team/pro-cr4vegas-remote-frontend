import { Marker } from 'mapbox-gl';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { PondStateEnum } from '../../../shared/constants/pond-state.enum';
import { UnitEntity } from '../unit/unit.entity';

export class UnitHydrantEntity {
  // ==================================================
  // API properties
  // ==================================================
  id: number;
  unit: UnitEntity;
  initBatch: number;
  diameter: number;
  filter: number;

  // ==================================================
  //  MQTT PROPERTIES
  // ==================================================
  valve$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  flow$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  reading$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  pressure$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  bouyLow$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  bouyMedium$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  bouyHight$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // ==================================================
  // FRONTEND PROPERTIES
  // ==================================================
  pondState$: BehaviorSubject<PondStateEnum> = new BehaviorSubject<PondStateEnum>(
    PondStateEnum.NA
  );
  bouyWarning$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  mqttSubscription: Subscription;
  marker: Marker;
  batch: number;

  // ==================================================
  //  STATUS
  // ==================================================
  public checkStatus(): void {
    this.checkBouysState();
    this.checkBouysWarnings();
    this.setMarkerColourAccourdingState();
    this.setMarkerAnimationAccordingState();
  }

  private checkBouysState(): void {
    let bouysState: PondStateEnum = null;
    if (this.bouyLow$.value === 0) {
      bouysState = PondStateEnum.LOW;
    }
    if (this.bouyLow$.value === 1) {
      bouysState = PondStateEnum.MEDIUM;
    }
    if (this.bouyMedium$.value === 1) {
      bouysState = PondStateEnum.HIGTH;
    }
    if (this.bouyHight$.value === 1) {
      bouysState = PondStateEnum.ALARM;
      // this._map.flyTo({ zoom: 18, animate: true, center: this.marker.getLngLat() });
    }
    if (this.pondState$.value !== bouysState) {
      this.pondState$.next(bouysState);
    }
  }

  private checkBouysWarnings(): void {
    let bouysWarnings = '';
    if (this.bouyLow$.value === 0 && this.bouyMedium$.value === 1) {
      bouysWarnings = 'Comprobar la boya baja';
    }
    if (
      this.bouyLow$.value === 0 &&
      this.bouyMedium$.value === 0 &&
      this.bouyHight$.value === 1
    ) {
      bouysWarnings = 'Comprobar las boyas baja y media. ';
    }
    if (
      this.bouyLow$.value === 1 &&
      this.bouyMedium$.value === 0 &&
      this.bouyHight$.value === 1
    ) {
      bouysWarnings = 'Comprobar las boya media. ';
    }
    if (
      (this.bouyLow$.value === 1 &&
        this.bouyMedium$.value === 1 &&
        this.bouyHight$.value === 0) ||
      (this.bouyLow$.value === 0 &&
        this.bouyMedium$.value === 1 &&
        this.bouyHight$.value === 0)
    ) {
      bouysWarnings = `
          ${bouysWarnings}
          En el estado "${this.pondState$.value}" deberías tomar precaución.
          La boya de Alarma de nivel solo se puede comprobar físicamente`;
    }
    this.bouyWarning$.next(bouysWarnings);
  }

  // ==================================================
  //  MARKER
  // ==================================================
  private setMarkerColourAccourdingState(): void {
    this.marker
      .getElement()
      .getElementsByTagName('div')[1].style.background = this.getMarkerColour();
  }

  public getMarkerColour(): string {
    if (this.unit.active === 1) {
      if (this.unit.communication === 1) {
        return this.getMarkerColourAccordingBouyState();
      } else {
        return MarkerColourEnum.WITHOUT_COMMUNICATION;
      }
    }
    return MarkerColourEnum.INACTIVE;
  }

  private getMarkerColourAccordingBouyState(this: UnitHydrantEntity): string {
    if (this.pondState$) {
      if (this.pondState$.value === PondStateEnum.LOW) {
        return MarkerColourEnum.UNIT_POND_LOW;
      }
      if (this.pondState$.value === PondStateEnum.MEDIUM) {
        return MarkerColourEnum.UNIT_POND_MEDIUM;
      }
      if (this.pondState$.value === PondStateEnum.HIGTH) {
        return MarkerColourEnum.UNIT_POND_HIGTH;
      }
      if (this.pondState$.value === PondStateEnum.ALARM) {
        return MarkerColourEnum.ALARM;
      }
    } else {
      return MarkerColourEnum.UNIT_POND_LOW;
    }
  }

  private setMarkerAnimationAccordingState(): void {
    if (this.valve$.value === 1) {
      if (this.bouyHight$.value === 1) {
        this.marker.getElement().style.boxShadow = '0px 0px 10px 5px red';
      } else {
        this.marker.getElement().style.boxShadow = '0px 0px 10px 5px green';
      }
    } else {
      this.marker.getElement().style.boxShadow = '';
    }
  }
}
