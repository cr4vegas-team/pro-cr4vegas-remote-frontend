import { Marker } from 'mapbox-gl';
import { Behavior } from 'popper.js';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { UnitEntity } from '../unit/unit.entity';

export class UnitStationPechinaEntity {

  // ==================================================
  //  API PROPERTIES
  // ==================================================
  id: number;
  unit: UnitEntity;
  readingBatch: number;

  // ==================================================
  //  MQTT PROPERTIES
  // ==================================================
  reading$: BehaviorSubject<number>;
  flow$: BehaviorSubject<number>;

  // ==================================================
  // FRONTEND PROPERTIES
  // ==================================================
  marker: Marker;
  mqttNodeSubscription: Subscription;
  mqttServerSubscription: Subscription;

  constructor() {
    this.flow$ = new BehaviorSubject(0);
    this.reading$ = new BehaviorSubject(0);
  }

  // ==================================================
  //  STATUS
  // ==================================================
  public checkStatus(): void {
    this.setMarkerAnimationAccordingState();
  }

  public getMarkerColour(): string {
    if (this.unit.active === 1) {
      if (this.unit.communication === 1) {
        this.setMarkerAnimationAccordingState();
      } else {
        return MarkerColourEnum.WITHOUT_COMMUNICATION;
      }
    }
    return MarkerColourEnum.INACTIVE;
  }

  private setMarkerAnimationAccordingState(): void {
    if (this.flow$.value === 1) {
      this.marker.getElement().style.boxShadow =
        '0px 0px 10px 5px green';
    } else {
      this.marker.getElement().style.boxShadow = '';
    }
  }
}
