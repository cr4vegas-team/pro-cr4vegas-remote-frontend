import { UnitPondEntity } from './unit-pond.entity';

export interface UnitPondRO {
  unitPond: UnitPondEntity;
}

export interface UnitsPondsRO {
  unitsPonds: UnitPondEntity[];
  count: number;
}
