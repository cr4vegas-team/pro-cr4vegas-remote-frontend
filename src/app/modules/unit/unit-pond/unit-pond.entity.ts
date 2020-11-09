import { PondStateEnum } from '../../../shared/constants/pond-state.enum';
import { Marker } from 'mapbox-gl';
import { BehaviorSubject, Subscription } from 'rxjs';
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
  nodeSubscription: Subscription;

  // ==================================================
  // FRONTEND PROPERTIES
  // ==================================================
  marker: Marker;
}
