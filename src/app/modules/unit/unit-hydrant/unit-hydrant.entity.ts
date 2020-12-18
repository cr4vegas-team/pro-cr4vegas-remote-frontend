import { Marker } from 'mapbox-gl';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PondStateEnum } from '../../../shared/constants/pond-state.enum';
import { UnitEntity } from '../unit/unit.entity';

export class UnitHydrantEntity {
  constructor() {}
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
  pondState$: BehaviorSubject<PondStateEnum> = new BehaviorSubject<PondStateEnum>(
    PondStateEnum.NA
  );
  bouyWarning$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  // ==================================================
  // FRONTEND PROPERTIES
  // ==================================================
  nodeSubscription: Subscription;
  marker: Marker;
}
