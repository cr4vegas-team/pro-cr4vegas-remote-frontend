import { Marker } from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { PondStateEnum } from '../../../shared/constants/pond-state.enum';
import { UnitEntity } from '../unit/unit.entity';

export class UnitHydrantEntity {
  constructor() {
    this.flow = 0;
    this.reading = 0;
    this.batch = 0;
    this.pressure = 0;
  }
  // ==================================================
  // API properties
  // ==================================================
  id: number;
  unit: UnitEntity;
  diameter: number;
  filter: number;

  // ==================================================
  //  MQTT PROPERTIES
  // ==================================================
  valve: number;
  flow: number;
  reading: number;
  batch: number;
  readingBatch: number;
  pressure: number;
  bouyLow: boolean;
  bouyMedium: boolean;
  bouyHight: boolean;
  pondState: PondStateEnum;
  bouyWarning: string;

  // ==================================================
  // FRONTEND PROPERTIES
  // ==================================================
  nodeSubscription: Subscription;
  serverSubscription: Subscription;
  marker: Marker;
  testInterval: NodeJS.Timeout;
}
