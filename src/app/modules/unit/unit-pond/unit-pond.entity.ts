import { Marker } from 'mapbox-gl';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { PondStateEnum } from '../../../shared/constants/pond-state.enum';
import { UnitEntity } from '../unit/unit.entity';

export class UnitPondEntity {
  constructor() {
    this.level$ = new BehaviorSubject<number>(0);
  }

  // ==================================================
  // API PROPERTIES
  // ==================================================
  id: number;
  unit: UnitEntity;
  m3: number;
  height: number;

  // ==================================================
  // MQTT PROPERTIES
  // ==================================================
  level$: BehaviorSubject<number>;
  pondState: PondStateEnum;

  // ==================================================
  // FRONTEND PROPERTIES
  // ==================================================
  marker: Marker;
  mqttNodeSubscription: Subscription;
  mqttServerSubscription: Subscription;

  // ==================================================
  //  MQTT
  // ==================================================
  public checkStatus(): void {
    this.checkBouysState();
    this.setMarkerColourAccourdingState();
  }

  private checkBouysState(): void {
    let bouysState: PondStateEnum = null;
    if (this.level$.value < this.level$.value / 3) {
      bouysState = PondStateEnum.LOW;
    }
    if (
      this.level$.value >= this.level$.value / 3 &&
      this.level$.value < this.level$.value / 2
    ) {
      bouysState = PondStateEnum.MEDIUM;
    }
    if (
      this.level$.value >= this.level$.value / 2 &&
      this.level$.value < this.level$.value - 0.2
    ) {
      bouysState = PondStateEnum.HIGTH;
    }
    if (this.level$.value >= this.level$.value - 0.2) {
      bouysState = PondStateEnum.ALARM;
    }
    if (this.pondState !== bouysState) {
      this.pondState = bouysState;
    }
  }

  private setMarkerColourAccourdingState(): void {
    this.marker
      .getElement()
      .getElementsByTagName(
        'div'
      )[1].style.color = this.getMarkerColour();
  }

  public getMarkerColour(this: UnitPondEntity): string {
    if (this.unit.active) {
      return this.getMarkerColourAccordingBouyState();
    }
    return MarkerColourEnum.INACTIVE;
  }

  private getMarkerColourAccordingBouyState(this: UnitPondEntity): string {
    if (this.pondState) {
      if (this.pondState === PondStateEnum.LOW) {
        return MarkerColourEnum.UNIT_POND_LOW;
      }
      if (this.pondState === PondStateEnum.MEDIUM) {
        return MarkerColourEnum.UNIT_POND_MEDIUM;
      }
      if (this.pondState === PondStateEnum.HIGTH) {
        return MarkerColourEnum.UNIT_POND_HIGTH;
      }
      if (this.pondState === PondStateEnum.ALARM) {
        return MarkerColourEnum.ALARM;
      }
    } else {
      return MarkerColourEnum.UNIT_POND_LOW;
    }
  }
}
