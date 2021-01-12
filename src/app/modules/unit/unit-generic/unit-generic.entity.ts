import { Marker } from 'mapbox-gl';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MarkerColourEnum } from 'src/app/shared/constants/marker-colour.enum';
import { UnitEntity } from '../unit/unit.entity';

export class UnitGenericEntity {
  // ==================================================
  // API PROPERTIES
  // ==================================================
  id: number;
  unit: UnitEntity;
  data1: string;
  data2: string;
  data3: string;
  data4: string;
  data5: string;

  // ==================================================
  // MQTT PROPERTIES
  // ==================================================
  property1$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  property2$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  property3$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  property4$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  property5$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  temperature$: BehaviorSubject<string> = new BehaviorSubject<string>('0');
  humidity$: BehaviorSubject<string> = new BehaviorSubject<string>('0');

  // ==================================================
  // FRONTEND PROPERTIES
  // ==================================================
  mqttSubscription: Subscription;
  marker: Marker;

  public setMarkerColourAccourdingState(): void {
    this.marker
      .getElement()
      .getElementsByTagName(
        'div'
      )[1].style.backgroundColor = this.getMarkerColour();
  }

  public getMarkerColour(): string {
    if (this.unit.active) {
      if (this.unit.communication) {
        return MarkerColourEnum.UNIT;
      } else {
        return MarkerColourEnum.WITHOUT_COMMUNICATION;
      }
    } else {
      return MarkerColourEnum.INACTIVE;
    }
  }
}
