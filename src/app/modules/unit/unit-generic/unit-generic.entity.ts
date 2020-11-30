import { Marker } from 'mapbox-gl';
import { Subscription, BehaviorSubject } from 'rxjs';
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
  property1$: BehaviorSubject<string> = new BehaviorSubject<string>('0');
  property2$: BehaviorSubject<string> = new BehaviorSubject<string>('0');
  property3$: BehaviorSubject<string> = new BehaviorSubject<string>('0');
  property4$: BehaviorSubject<string> = new BehaviorSubject<string>('0');
  property5$: BehaviorSubject<string> = new BehaviorSubject<string>('0');
  temperature$: BehaviorSubject<string> = new BehaviorSubject<string>('0');
  humidity$: BehaviorSubject<string> = new BehaviorSubject<string>('0');

  // ==================================================
  // FRONTEND PROPERTIES
  // ==================================================
  nodeSubscription: Subscription;
  marker: Marker;
}
