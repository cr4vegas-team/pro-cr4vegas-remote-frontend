import { Marker } from 'mapbox-gl';
import { Subscription } from 'rxjs';
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
  property1: string;
  property2: string;
  property3: string;
  property4: string;
  property5: string;

  // ==================================================
  // FRONTEND PROPERTIES
  // ==================================================
  nodeSubscription: Subscription;
  serverSubscription: Subscription;
  marker: Marker;
  testInterval: NodeJS.Timeout;
}
